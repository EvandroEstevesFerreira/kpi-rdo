// ─── Configuração ─────────────────────────────────────────────────────────────
const BASE      = '/api/diario';
const USE_MOCK  = import.meta.env.VITE_USE_MOCK === 'true';

// Cache em memória — evita chamadas repetidas em 5 min
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
  const qs  = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null)
  ).toString();
  const url = `${BASE}${path}${qs ? '?' + qs : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`API ${res.status} — ${path} — ${detail}`);
  }
  return res.json();
};

// ─── Endpoints ───────────────────────────────────────────────────────────────

/** Lista todas as obras ativas */
export const getObras = () =>
  cached('obras', () => get('/obras', { status: 'active' }), 600_000);

/** Detalhes de uma obra */
export const getObraDetalhes = (id) =>
  cached(`obra-${id}`, () => get(`/obras/${id}`), 600_000);

/** RDOs de uma obra — limit alto para cobrir 30+ dias */
export const getRelatorios = (projectId, limit = 200) =>
  cached(
    `rdos-${projectId}`,
    () => get(`/obras/${projectId}/relatorios`, { limit, order: 'desc' }),
    300_000
  );

/** Lista de tarefas — avanço físico */
export const getTarefas = (projectId) =>
  cached(
    `tarefas-${projectId}`,
    () => get(`/obras/${projectId}/tarefas`),
    300_000
  );

/** Limpa o cache (útil para forçar refresh) */
export const limparCache = () => _cache.clear();

// ─── Utilitários de data ──────────────────────────────────────────────────────
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
  Math.abs((new Date(b) - new Date(a)) / 86_400_000);

// ─── Extratores defensivos (lida com variações da API) ───────────────────────
const dataRdo      = (r) => r.data || r.dataRelatorio || r.createdAt;
const idProjeto    = (o) => o._id  || o.id;
const qtdFotos     = (r) => r.fotos?.total ?? r.qtdFotos ?? r.totalFotos ?? 0;
const aprovacoes   = (r) => r.aprovacoes || r.assinaturas || [];
const criadoEm     = (r) => r.criadoEm   || r.createdAt   || r.data;
const tipoOcorrencia = (oc) => oc.tipo || oc.tipoOcorrencia || oc.categoria || 'Outros';

const eAprovado  = (ap) => ['aprovado', 'approved'].includes(ap.status);
const ePendente  = (ap) => ['pendente', 'aguardando', 'pending'].includes(ap.status);
const dataAp     = (ap) => ap.dataAprovacao || ap.dataAssinatura || ap.updatedAt;

// ─── Cálculo de KPIs ─────────────────────────────────────────────────────────

/**
 * Recebe array de RDOs brutos da API e retorna todos os KPIs calculados.
 * @param {Array}  relatorios  - RDOs retornados pelo endpoint /relatorios
 * @param {string} inicio      - Data inicial "YYYY-MM-DD"
 * @param {string} fim         - Data final   "YYYY-MM-DD"
 */
export const calcularKPIs = (relatorios, inicio, fim) => {
  const rdos = (relatorios || []).filter((r) => {
    const d = new Date(dataRdo(r));
    return d >= new Date(inicio) && d <= new Date(fim);
  });

  const total    = rdos.length;
  const esperado = diasUteis(inicio, fim);

  // Taxa de emissão
  const taxaEmissao = esperado
    ? Math.min(100, Math.round((total / esperado) * 100))
    : 0;

  // % RDOs aprovados dentro do prazo pelo aprovador de índice `idx`
  const prazoOk = (idx, limiteDias) => {
    if (!total) return 0;
    const ok = rdos.filter((r) => {
      const ap = aprovacoes(r)[idx];
      if (!ap || !eAprovado(ap)) return false;
      return diffDias(criadoEm(r), dataAp(ap)) <= limiteDias;
    }).length;
    return Math.round((ok / total) * 100);
  };

  const aprovador1 = prazoOk(0, 1);
  const aprovador2 = prazoOk(1, 2);
  const aprovador3 = prazoOk(2, 7);

  // Tempo médio de aprovação por aprovador (em dias)
  const tempoMedio = (idx) => {
    const tempos = rdos
      .map((r) => {
        const ap = aprovacoes(r)[idx];
        if (!ap || !eAprovado(ap)) return null;
        return diffDias(criadoEm(r), dataAp(ap));
      })
      .filter((t) => t != null);
    if (!tempos.length) return null;
    return +(tempos.reduce((a, b) => a + b, 0) / tempos.length).toFixed(1);
  };

  // RDOs com pelo menos 1 aprovação pendente
  const pendentes = rdos.filter((r) =>
    aprovacoes(r).some(ePendente)
  ).length;

  // Média de fotos por RDO
  const mediaFotos = total
    ? Math.round(rdos.reduce((s, r) => s + qtdFotos(r), 0) / total)
    : 0;

  // Ocorrências agrupadas por tipo
  const ocorrencias = Object.entries(
    rdos
      .flatMap((r) => r.ocorrencias || [])
      .reduce((acc, oc) => {
        const tipo   = tipoOcorrencia(oc);
        acc[tipo] = (acc[tipo] || 0) + 1;
        return acc;
      }, {})
  )
    .map(([tipo, qtd]) => ({ tipo, qtd }))
    .sort((a, b) => b.qtd - a.qtd);

  // Conformidade geral ponderada
  const conformidade = Math.round(
    taxaEmissao * 0.40 +
    aprovador1  * 0.20 +
    aprovador2  * 0.20 +
    aprovador3  * 0.20
  );

  // Evolução semanal (últimas 5 semanas)
  const evolucaoSemanal = calcularEvolucaoSemanal(rdos, fim);

  return {
    taxaEmissao,
    aprovador1,
    aprovador2,
    aprovador3,
    pendentes,
    mediaFotos,
    ocorrencias,
    conformidade,
    totalRdos:  total,
    esperados:  esperado,
    tempoMedio: {
      ap1: tempoMedio(0),
      ap2: tempoMedio(1),
      ap3: tempoMedio(2),
    },
    evolucaoSemanal,
  };
};

// Agrupa RDOs por semana e calcula taxa de emissão em cada uma
const calcularEvolucaoSemanal = (rdos, fimStr, numSemanas = 5) => {
  const semanas = [];
  const fim = new Date(fimStr);

  for (let i = numSemanas - 1; i >= 0; i--) {
    const fimSem   = new Date(fim);
    fimSem.setDate(fim.getDate() - i * 7);
    const inicioSem = new Date(fimSem);
    inicioSem.setDate(fimSem.getDate() - 6);

    const rdosSem = rdos.filter((r) => {
      const d = new Date(dataRdo(r));
      return d >= inicioSem && d <= fimSem;
    });

    const esperadoSem = diasUteis(
      inicioSem.toISOString().slice(0, 10),
      fimSem.toISOString().slice(0, 10)
    );

    semanas.push({
      sem:      `S${numSemanas - i}`,
      emitidos: rdosSem.length,
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
