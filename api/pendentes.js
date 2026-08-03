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
const FETCH_CONCURRENCY = 6;
const PAPEIS = ['Supervisor da Obra', 'Gerente do Contrato', 'Cliente / Fiscalização'];

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.authorization || '';
    const qsSecret = ((req.query && req.query.secret) || '').toString();
    const matchDireto = auth === `Bearer ${secret}` || qsSecret === secret;
    const matchTrim   = qsSecret.trim() === secret.trim();
    if (!matchDireto && !matchTrim) {
      // Diagnóstico NÃO-sensível: só tamanhos, nunca os valores.
      res.status(401).json({
        error: 'Não autorizado',
        debug: {
          tamanhoEsperado: secret.length,
          tamanhoRecebido: qsSecret.length,
          iguaisAposTrim: matchTrim,
          primeiros4Esperado: secret.slice(0, 4),
          primeiros4Recebido: qsSecret.slice(0, 4),
        },
      });
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
      const listagem = await api(`/obras/${obra._id}/relatorios`, { limite: 200, ordem: 'desc' });
      const rdos = Array.isArray(listagem) ? listagem : (listagem.relatorios || listagem.data || []);

      const detalhes = await pMap(
        rdos.map((r) => r._id),
        (id) => api(`/obras/${obra._id}/relatorios/${id}`).catch(() => null),
        FETCH_CONCURRENCY,
      );

      for (const rdo of detalhes) {
        if (!rdo) continue;
        const aps = rdo.assinaturasEletronicaUrl || [];
        const supOk = aps[0]?.aprovado === true;
        const gerOk = aps[1]?.aprovado === true;
        // Pendência interna: supervisor OU gerente ainda não assinaram.
        if (supOk && gerOk) continue;

        // Quem está devendo agora = primeiro interno não aprovado.
        const idxPendente = !supOk ? 0 : 1;
        const pendente = aps[idxPendente] || {};
        const nomePend = pendente.usuarioNome || '';
        const emailPend = pendente.usuarioEmail || '';

        if (filtroAprovador &&
            !(`${nomePend} ${emailPend}`.toLowerCase().includes(filtroAprovador))) {
          continue;
        }

        // Dias parado: desde a aprovação anterior (se houver) ou a criação.
        const marco = idxPendente > 0 && aps[idxPendente - 1]?.dataHora
          ? parseDataBR(aps[idxPendente - 1].dataHora)
          : (parseDataBR(rdo.log?.criadoPor?.dataHora) || parseDataBR(rdo.data));
        const diasParado = marco
          ? Math.floor((Date.now() - marco.getTime()) / 86_400_000)
          : null;

        linhas.push({
          obra: obra.nome,
          rdoId: rdo._id,
          numero: rdo.numero ?? null,
          data: rdo.data || null,
          aprovadorPendente: nomePend,
          emailPendente: emailPend,
          papel: PAPEIS[idxPendente] || `Aprovador ${idxPendente + 1}`,
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

async function diarioGet(base, empresaId, apiKey, path, params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)),
  ).toString();
  const target = `${base}/empresas/${empresaId}${path}${qs ? '?' + qs : ''}`;
  const r = await fetch(target, {
    headers: { 'Token': apiKey, 'App-Iss': 'app-web', 'Accept': 'application/json' },
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`API ${r.status} em ${path}: ${body}`);
  }
  return r.json();
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
