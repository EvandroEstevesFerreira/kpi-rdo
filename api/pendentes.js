// Endpoint de consulta (somente leitura) — lista os RDOs com pendência
// INTERNA de aprovação: aqueles em que o Supervisor (posição 0) OU o
// Gerente (posição 1) ainda não assinaram. Exclui os que já passaram do
// gerente e só aguardam o cliente.
//
// Formatos:
//   GET /api/pendentes            -> JSON
//   GET /api/pendentes?formato=csv -> CSV (download em planilha)
//
// Filtros opcionais:
//   ?obra=<trecho do nome>   -> filtra por nome da obra (case-insensitive)
//   ?aprovador=<trecho>      -> filtra por nome/e-mail do aprovador pendente
//
// Auth: mesmo CRON_SECRET do cron de notificação (Bearer ou ?secret=).

const DEFAULT_BASE = 'https://api.diariodeobra.app/v2';
const WEB_BASE     = 'https://web.diariodeobra.app/#/app';
const FETCH_CONCURRENCY = 3;
const PAPEIS = ['Supervisor da Obra', 'Gerente do Contrato', 'Cliente / Fiscalização'];

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.authorization || '';
    const qsSecret = ((req.query && req.query.secret) || '').toString();
    if (auth !== `Bearer ${secret}` && qsSecret.trim() !== secret.trim()) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }
  }

  const empresaId = process.env.DIARIO_EMPRESA_ID;
  const apiKey    = process.env.DIARIO_API_KEY;
  if (!empresaId || !apiKey) {
    res.status(500).json({ error: 'DIARIO_EMPRESA_ID / DIARIO_API_KEY não configurados' });
    return;
  }

  const base = (process.env.DIARIO_API_BASE || DEFAULT_BASE).replace(/\/+$/, '');
  const api  = (path, params = {}) => diarioGet(base, empresaId, apiKey, path, params);

  const filtroObra      = (req.query?.obra || '').toString().toLowerCase();
  const filtroAprovador = (req.query?.aprovador || '').toString().toLowerCase();
  const formato         = (req.query?.formato || 'json').toString().toLowerCase();

  try {
    const obrasData = await api('/obras', { grupoObra: true });
    let obras = (obrasData.obras || []).filter((o) => o?.status?.id === 3);
    if (filtroObra) obras = obras.filter((o) => (o.nome || '').toLowerCase().includes(filtroObra));

    const linhas = [];

    for (const obra of obras) {
      // Usa o endpoint que ja devolve SO os RDOs aguardando aprovacao —
      // conjunto muito menor que varrer todos os relatorios, evitando
      // estourar o rate limit da API do diariodeobra.
      let ids = [];
      try {
        const aguardando = await api(`/obras/${obra._id}/relatorios-aguardando-aprovacao`);
        const lista = Array.isArray(aguardando)
          ? aguardando
          : (aguardando.relatorios || aguardando.data || aguardando.aguardando || []);
        ids = lista.map((r) => r._id || r.id).filter(Boolean);
      } catch {
        // Fallback: se o endpoint nao existir/responder, cai para a
        // listagem geral (limitada) — mas so os 60 mais recentes.
        const listagem = await api(`/obras/${obra._id}/relatorios`, { limite: 60, ordem: 'desc' });
        const rdos = Array.isArray(listagem) ? listagem : (listagem.relatorios || listagem.data || []);
        ids = rdos.map((r) => r._id).filter(Boolean);
      }

      const detalhes = await pMap(
        ids,
        (id) => api(`/obras/${obra._id}/relatorios/${id}`).catch(() => null),
        FETCH_CONCURRENCY,
      );

      for (const rdo of detalhes) {
        if (!rdo) continue;
        const aps = rdo.assinaturasEletronicaUrl || [];

        // Dias parado: desde a criação do RDO.
        const criado = parseDataBR(rdo.log?.criadoPor?.dataHora) || parseDataBR(rdo.data);
        const diasParado = criado
          ? Math.floor((Date.now() - criado.getTime()) / 86_400_000)
          : null;

        if (filtroAprovador) {
          // Modo "por aprovador": inclui o RDO se a assinatura DESTA
          // pessoa ainda nao foi dada (independente de ser a vez dela).
          const idx = aps.findIndex((a) =>
            `${a?.usuarioNome || ''} ${a?.usuarioEmail || ''}`.toLowerCase().includes(filtroAprovador));
          if (idx < 0) continue;               // essa pessoa nao assina esse RDO
          if (aps[idx]?.aprovado === true) continue; // ja assinou

          // "Vez dele" se todos os anteriores ja assinaram; senao esta
          // represado atras (informa quem esta segurando).
          const anterioresOk = aps.slice(0, idx).every((a) => a?.aprovado === true);
          const bloqueador = anterioresOk
            ? null
            : (aps.slice(0, idx).find((a) => a?.aprovado !== true) || {});

          linhas.push({
            obra: obra.nome,
            rdoId: rdo._id,
            numero: rdo.numero ?? null,
            data: rdo.data || null,
            aprovadorPendente: aps[idx]?.usuarioNome || '',
            emailPendente: aps[idx]?.usuarioEmail || '',
            papel: aps[idx]?.usuarioCargo || PAPEIS[idx] || `Aprovador ${idx + 1}`,
            situacao: anterioresOk ? 'vez dele' : 'aguardando etapa anterior',
            bloqueadoPor: bloqueador ? (bloqueador.usuarioNome || '') : null,
            diasParado,
            link: `${WEB_BASE}/obras/${obra._id}/relatorios/${rdo._id}`,
          });
          continue;
        }

        // Modo geral (sem filtro): pendencia INTERNA — supervisor OU
        // gerente ainda nao assinaram. Atribui ao primeiro da fila.
        const supOk = aps[0]?.aprovado === true;
        const gerOk = aps[1]?.aprovado === true;
        if (supOk && gerOk) continue;
        const idxPendente = !supOk ? 0 : 1;
        const pendente = aps[idxPendente] || {};

        linhas.push({
          obra: obra.nome,
          rdoId: rdo._id,
          numero: rdo.numero ?? null,
          data: rdo.data || null,
          aprovadorPendente: pendente.usuarioNome || '',
          emailPendente: pendente.usuarioEmail || '',
          papel: pendente.usuarioCargo || PAPEIS[idxPendente] || `Aprovador ${idxPendente + 1}`,
          situacao: 'vez dele',
          bloqueadoPor: null,
          diasParado,
          link: `${WEB_BASE}/obras/${obra._id}/relatorios/${rdo._id}`,
        });
      }
    }

    // Ordena por dias parado (mais antigo primeiro).
    linhas.sort((a, b) => (b.diasParado ?? -1) - (a.diasParado ?? -1));

    if (formato === 'csv') {
      const csv = paraCsv(linhas);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="rdos-pendentes.csv"');
      res.status(200).send('﻿' + csv); // BOM p/ Excel abrir acentos certo
      return;
    }

    res.status(200).json({ total: linhas.length, pendentes: linhas });
  } catch (err) {
    console.error('[pendentes] Exceção:', err);
    res.status(500).json({ error: 'Erro na varredura', detail: err.message });
  }
}

function paraCsv(linhas) {
  const cols = [
    ['obra', 'Obra'],
    ['numero', 'RDO'],
    ['data', 'Data'],
    ['aprovadorPendente', 'Aprovador pendente'],
    ['emailPendente', 'E-mail'],
    ['papel', 'Papel'],
    ['situacao', 'Situação'],
    ['bloqueadoPor', 'Bloqueado por'],
    ['diasParado', 'Dias parado'],
    ['link', 'Link'],
  ];
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.map(([, label]) => esc(label)).join(';');
  const rows = linhas.map((l) => cols.map(([key]) => esc(l[key])).join(';'));
  return [header, ...rows].join('\n');
}

function parseDataBR(s) {
  if (!s || typeof s !== 'string') return null;
  const [dataParte, horaParte] = s.trim().split(/\s+/);
  const [dia, mes, ano] = dataParte.split('/').map(Number);
  if (!dia || !mes || !ano) return null;
  const [hh = 0, mm = 0] = (horaParte || '').split(':').map(Number);
  return new Date(ano, mes - 1, dia, hh, mm);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function diarioGet(base, empresaId, apiKey, path, params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)),
  ).toString();
  const target = `${base}/empresas/${empresaId}${path}${qs ? '?' + qs : ''}`;

  // Retry com backoff em caso de 429 (limite por minuto da API).
  const esperas = [2000, 5000, 10000];
  for (let tentativa = 0; ; tentativa++) {
    const r = await fetch(target, {
      headers: { 'Token': apiKey, 'App-Iss': 'app-web', 'Accept': 'application/json' },
    });
    if (r.ok) return r.json();
    if (r.status === 429 && tentativa < esperas.length) {
      await sleep(esperas[tentativa]);
      continue;
    }
    const body = await r.text().catch(() => '');
    throw new Error(`API ${r.status} em ${path}: ${body}`);
  }
}

async function pMap(items, fn, concurrency = 6) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length || 1) }, async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}
