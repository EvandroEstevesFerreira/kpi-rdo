// ─── Configuração ─────────────────────────────────────────────────────────────
// Todas as chamadas passam pelo proxy serverless em /api/diario, que
// injeta os headers Token, App-Iss e o prefixo /empresas/{empresaId}.
const BASE     = '/api/diario';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Concorrência máxima ao buscar detalhes de RDO em paralelo.
// Suficiente pra carregar ~90 RDOs em poucos segundos sem
// estourar limites do upstream.
const FETCH_CONCURRENCY = 6;

// Cache em memória
const _cache = new Map();

const cached = async (key, fn, ttl = 300_000) => {
  const hit = _cache.get(key);
  if (hit && Date.now() - hit.ts < ttl) return hit.data;
  const data = await fn();
  _cache.set(key, { data, ts: Date.now() });
  return data;
};

// ─── Requisição base ─────────────────────────────────────────────────────────
const get = async (path, params = {}) => {
  const qs = new URLSearchParams({
    ...Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)),
    t: Date.now(),
  }).toString();
  const url = `${BASE}${path}?${qs}`;
  const res = await fetch(url);
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`API ${res.status} — ${path} — ${detail}`);
  }
  return res.json();
};

// ─── Parser de datas brasileiras ─────────────────────────────────────────────
// A API retorna datas no formato "DD/MM/YYYY" ou "DD/MM/YYYY HH:mm".
// new Date() não interpreta esse formato corretamente.
export const parseDataBR = (s) => {
  if (!s || typeof s !== 'string') return null;
  const [dataParte, horaParte] = s.trim().split(/\s+/);
  const [dia, mes, ano] = dataParte.split('/').map(Number);
  if (!dia || !mes || !ano) return null;
  const [hh = 0, mm = 0] = (horaParte || '').split(':').map(Number);
  return new Date(ano, mes - 1, dia, hh, mm);
};

const formatDataBR = (d) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

// ─── Endpoints ───────────────────────────────────────────────────────────────

/** Lista obras ativas (status.id === 3 = Em Andamento) */
export const getObras = () =>
  cached('obras', async () => {
    const data = await get('/obras', { grupoObra: true });
    return (data.obras || []).filter((o) => o?.status?.id === 3);
  }, 600_000);

export const getObraDetalhes = (id) =>
  cached(`obra-${id}`, () => get(`/obras/${id}`), 600_000);

/** Listing leve de RDOs */
export const getRelatorios = (obraId, limite = 200) =>
  cached(
    `rdos-${obraId}`,
    () => get(`/obras/${obraId}/relatorios`, { limite, ordem: 'desc' }),
    300_000,
  );

/** Detalhe completo de 1 RDO (necessário para extrair aprovações) */
export const getRelatorioDetalhe = (obraId, rdoId) =>
  cached(
    `rdo-${obraId}-${rdoId}`,
    () => get(`/obras/${obraId}/relatorios/${rdoId}`),
    600_000,
  );

export const getPendentesAprovacao = (obraId) =>
  cached(
    `pendentes-${obraId}`,
    () => get(`/obras/${obraId}/relatorios-aguardando-aprovacao`),
    300_000,
  );

export const limparCache = () => _cache.clear();

// ─── Buscador com concorrência limitada ──────────────────────────────────────
const pMap = async (items, fn, concurrency = FETCH_CONCURRENCY) => {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      try {
        results[idx] = await fn(items[idx], idx);
      } catch (err) {
        console.warn('[pMap] item falhou', items[idx], err.message);
        results[idx] = null;
      }
    }
  });
  await Promise.all(workers);
  return results;
};

/**
 * Carrega o detalhe completo dos RDOs de uma obra cuja data esteja
 * dentro da janela [inicio, fim]. Retorna apenas os detalhes (RDOs completos).
 */
export const getRelatoriosNaJanela = async (obraId, inicio, fim) => {
  const lista   = await getRelatorios(obraId);
  const inicioD = new Date(inicio);
  const fimD    = new Date(fim);

  const idsNaJanela = lista
    .filter((r) => {
      const d = parseDataBR(r.data);
      return d && d >= inicioD && d <= fimD;
    })
    .map((r) => r._id);

  const detalhes = await pMap(idsNaJanela, (id) =>
    getRelatorioDetalhe(obraId, id)
  );
  return detalhes.filter(Boolean);
};

// ─── Utilitários de cálculo ──────────────────────────────────────────────────
const diasUteis = (inicio, fim) => {
  let count = 0;
  const d   = new Date(inicio);
  const end = new Date(fim);
  while (d <= end) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
};

const diffDias = (a, b) =>
  Math.abs((b.getTime() - a.getTime()) / 86_400_000);

// ─── Extratores (alinhados à API real) ───────────────────────────────────────
const dataRdo    = (r) => parseDataBR(r.data);
const criadoEm   = (r) => parseDataBR(r.log?.criadoPor?.dataHora) || parseDataBR(r.data);
const aprovacoes = (r) => r.assinaturasEletronicaUrl || [];
const qtdFotos   = (r) => r.galeriaDeFotos?.length ?? r.totalFotos ?? 0;
const ocorrenciasDe = (r) =>
  Array.isArray(r.ocorrencias) ? r.ocorrencias : [];
const tipoOcorrencia = (oc) =>
  oc.tipo || oc.descricao || oc.categoria?.descricao || 'Outros';

const eAprovado = (ap) => ap?.aprovado === true;
const dataAp    = (ap) => parseDataBR(ap?.dataHora);

// Extrai todas as entradas de mao de obra de um RDO (padrao + personalizada)
const maoDeObraDe = (r) => {
  const padrao        = r.maoDeObra?.padrao || [];
  const personalizada = r.maoDeObra?.personalizada || [];
  return [...padrao, ...personalizada]
    .filter((m) => m && m.descricao && typeof m.quantidade === 'number');
};

// Calcula a media diaria de efetivo e o breakdown por funcao/categoria
const calcularEfetivo = (rdos) => {
  // Mapa funcao -> { totalPessoasDias, diasComRegistro, categoria }
  const porFuncao = new Map();
  // Mapa categoria -> { totalPessoasDias, diasComRegistro }
  const porCategoria = new Map();
  // Soma diaria de pessoas em cada RDO (para a media geral)
  let somaTotalDiario = 0;
  let diasComEfetivo  = 0;

  for (const r of rdos) {
    const itens = maoDeObraDe(r);
    if (!itens.length) continue;

    let totalNoDia = 0;
    diasComEfetivo++;

    for (const item of itens) {
      const funcao    = item.descricao;
      const qtd       = item.quantidade || 0;
      const categoria = item.categoria?.descricao || 'Sem categoria';

      totalNoDia += qtd;

      const prevF = porFuncao.get(funcao) || { total: 0, dias: 0, categoria };
      prevF.total += qtd;
      prevF.dias  += 1;
      prevF.categoria = categoria; // mantem ultima conhecida
      porFuncao.set(funcao, prevF);

      const prevC = porCategoria.get(categoria) || { total: 0, dias: 0 };
      prevC.total += qtd;
      prevC.dias  += 1;
      porCategoria.set(categoria, prevC);
    }

    somaTotalDiario += totalNoDia;
  }

  const mediaDiaria = diasComEfetivo
    ? Math.round(somaTotalDiario / diasComEfetivo)
    : 0;

  // Para "media diaria por funcao" usamos diasComEfetivo (e nao item.dias),
  // assim o numero reflete "em media, quantos X tinhamos por dia da obra".
  const denom = diasComEfetivo || 1;
  const funcoes = [...porFuncao.entries()]
    .map(([funcao, v]) => ({
      funcao,
      categoria: v.categoria,
      mediaPorDia: Math.round((v.total / denom) * 10) / 10,
      totalPessoasDias: v.total,
      diasPresente: v.dias,
    }))
    .sort((a, b) => b.mediaPorDia - a.mediaPorDia);

  const categorias = [...porCategoria.entries()]
    .map(([categoria, v]) => ({
      categoria,
      mediaPorDia: Math.round((v.total / denom) * 10) / 10,
      totalPessoasDias: v.total,
    }))
    .sort((a, b) => b.mediaPorDia - a.mediaPorDia);

  return {
    mediaDiaria,
    diasComEfetivo,
    totalPessoasDias: somaTotalDiario,
    porFuncao: funcoes,
    porCategoria: categorias,
  };
};

// ─── Cálculo de KPIs ─────────────────────────────────────────────────────────
/**
 * @param {Array}  rdos   - RDOs detalhados (já filtrados na janela)
 * @param {string} inicio - "YYYY-MM-DD"
 * @param {string} fim    - "YYYY-MM-DD"
 */
export const calcularKPIs = (rdos, inicio, fim, opts = {}) => {
  const { numObras = 1 } = opts;
  rdos = rdos || [];
  const total    = rdos.length;
  const esperado = diasUteis(inicio, fim) * numObras;

  const taxaEmissao = esperado
    ? Math.min(100, Math.round((total / esperado) * 100))
    : 0;

  // % RDOs aprovados pelo aprovador `idx` dentro do prazo (dias)
  const prazoOk = (idx, limiteDias) => {
    if (!total) return 0;
    const ok = rdos.filter((r) => {
      const ap = aprovacoes(r)[idx];
      if (!eAprovado(ap)) return false;
      const inicioRdo = criadoEm(r);
      const fimAp     = dataAp(ap);
      if (!inicioRdo || !fimAp) return false;
      return diffDias(inicioRdo, fimAp) <= limiteDias;
    }).length;
    return Math.round((ok / total) * 100);
  };

  const aprovador1 = prazoOk(0, 1);
  const aprovador2 = prazoOk(1, 2);
  const aprovador3 = prazoOk(2, 7);

  const tempoMedio = (idx) => {
    const tempos = rdos
      .map((r) => {
        const ap = aprovacoes(r)[idx];
        if (!eAprovado(ap)) return null;
        const inicioRdo = criadoEm(r);
        const fimAp     = dataAp(ap);
        if (!inicioRdo || !fimAp) return null;
        return diffDias(inicioRdo, fimAp);
      })
      .filter((t) => t != null);
    if (!tempos.length) return null;
    return +(tempos.reduce((a, b) => a + b, 0) / tempos.length).toFixed(1);
  };

  // RDO com pelo menos 1 aprovação ainda não aprovada
  const pendentes = rdos.filter((r) =>
    aprovacoes(r).some((ap) => !eAprovado(ap))
  ).length;

  const mediaFotos = total
    ? Math.round(rdos.reduce((s, r) => s + qtdFotos(r), 0) / total)
    : 0;

  const ocorrencias = Object.entries(
    rdos
      .flatMap((r) => ocorrenciasDe(r))
      .reduce((acc, oc) => {
        const tipo = tipoOcorrencia(oc);
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
      }, {})
  )
    .map(([tipo, qtd]) => ({ tipo, qtd }))
    .sort((a, b) => b.qtd - a.qtd);

  const conformidade = Math.round(
    taxaEmissao * 0.40 +
    aprovador1  * 0.20 +
    aprovador2  * 0.20 +
    aprovador3  * 0.20
  );

  const efetivo = calcularEfetivo(rdos);

  return {
    taxaEmissao,
    aprovador1,
    aprovador2,
    aprovador3,
    pendentes,
    mediaFotos,
    ocorrencias,
    conformidade,
    totalRdos: total,
    esperados: esperado,
    tempoMedio: {
      ap1: tempoMedio(0),
      ap2: tempoMedio(1),
      ap3: tempoMedio(2),
    },
    evolucaoSemanal: calcularEvolucaoSemanal(rdos, fim, 5, numObras),
    efetivo,
    aprovadoresRanking: calcularAprovadoresRanking(rdos),
    ultimosRdos: rdos
      .slice()
      .sort((a, b) => (dataRdo(b)?.getTime() || 0) - (dataRdo(a)?.getTime() || 0))
      .slice(0, 10)
      .map((r) => ({
        id: r._id,
        numero: r.numero,
        data: r.data,
        totalFotos: qtdFotos(r),
        linkPdf: r.linkPdf || null,
        obraNome: r.__obraNome || null,
        statusAprovacao: aprovacoes(r).every(eAprovado)
          ? 'aprovado'
          : aprovacoes(r).some(eAprovado) ? 'parcial' : 'pendente',
      })),
  };
};

const calcularAprovadoresRanking = (rdos) => {
  const limites = [1, 2, 7];
  const papeis  = ['Supervisor (D+1)', 'Gerente (D+2)', 'Cliente (D+7)'];
  const map     = new Map();

  for (const r of rdos) {
    const aps = aprovacoes(r);
    aps.forEach((ap, idx) => {
      if (!eAprovado(ap)) return;
      const nome = ap.usuarioNome;
      if (!nome) return;
      const inicioRdo = criadoEm(r);
      const fimAp     = dataAp(ap);
      if (!inicioRdo || !fimAp) return;
      const tempo = diffDias(inicioRdo, fimAp);
      const dentro = tempo <= (limites[idx] ?? 7);

      const key  = `${nome}__${idx}`;
      const prev = map.get(key) || {
        nome,
        cargo:  ap.usuarioCargo || '',
        papel:  papeis[idx] || `Aprovador ${idx + 1}`,
        total: 0,
        somaTempo: 0,
        dentroPrazo: 0,
      };
      prev.total       += 1;
      prev.somaTempo   += tempo;
      if (dentro) prev.dentroPrazo += 1;
      map.set(key, prev);
    });
  }

  return [...map.values()]
    .map((u) => ({
      ...u,
      tempoMedio: +(u.somaTempo / u.total).toFixed(1),
      taxaPrazo:  Math.round((u.dentroPrazo / u.total) * 100),
    }))
    .sort((a, b) => b.tempoMedio - a.tempoMedio);
};

const calcularEvolucaoSemanal = (rdos, fimStr, numSemanas = 5, numObras = 1) => {
  const semanas = [];
  const fim = new Date(fimStr);

  for (let i = numSemanas - 1; i >= 0; i--) {
    const fimSem = new Date(fim);
    fimSem.setDate(fim.getDate() - i * 7);
    const inicioSem = new Date(fimSem);
    inicioSem.setDate(fimSem.getDate() - 6);

    const rdosSem = rdos.filter((r) => {
      const d = dataRdo(r);
      return d && d >= inicioSem && d <= fimSem;
    });

    const esperadoSem = diasUteis(
      inicioSem.toISOString().slice(0, 10),
      fimSem.toISOString().slice(0, 10)
    ) * numObras;

    semanas.push({
      sem:       `S${numSemanas - i}`,
      emitidos:  rdosSem.length,
      esperados: esperadoSem,
      taxa:      esperadoSem
        ? Math.min(100, Math.round((rdosSem.length / esperadoSem) * 100))
        : 0,
      fotos: rdosSem.length
        ? Math.round(rdosSem.reduce((s, r) => s + qtdFotos(r), 0) / rdosSem.length)
        : 0,
    });
  }

  return semanas;
};

// Re-exporta utilidades de data para uso em componentes
export { formatDataBR };
