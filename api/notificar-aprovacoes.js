// Cron serverless — notifica por e-mail o PRÓXIMO aprovador de cada RDO.
//
// Como a API do diariodeobra.app não emite webhook, detectamos por
// varredura: a cada execução buscamos os RDOs e olhamos o array
// `assinaturasEletronicaUrl`. Quem está com `proximoAprovar: true` é
// quem precisa ser avisado. Um store de deduplicação (Vercel KV) garante
// que cada pessoa seja notificada UMA vez por posição de aprovação em
// cada RDO — sem isso, cada execução do cron reenviaria tudo.
//
// SEGURANÇA / GRADUALIDADE:
//   - Sem KV configurado  -> nunca envia (força dry-run) para não spammar.
//   - NOTIFY_ENABLED != 'true' -> dry-run (loga o que enviaria).
//   - Requer CRON_SECRET (header Authorization: Bearer, injetado pelo
//     Vercel Cron) ou ?secret= para chamadas manuais.
//
// Env vars:
//   DIARIO_API_KEY, DIARIO_EMPRESA_ID, DIARIO_API_BASE  (já existentes)
//   RESEND_API_KEY        - chave do Resend
//   NOTIFY_FROM           - remetente, ex: "RDO Sistenge <rdo@sistenge.com>"
//   NOTIFY_ENABLED        - "true" para enviar de verdade
//   NOTIFY_DASHBOARD_URL  - base do dashboard p/ link (ex: https://kpi-rdo.vercel.app)
//   CRON_SECRET           - protege o endpoint (Vercel injeta em crons)
//   KV_REST_API_URL, KV_REST_API_TOKEN - Vercel KV (dedup)

const DEFAULT_BASE = 'https://api.diariodeobra.app/v2';
const WEB_BASE     = 'https://web.diariodeobra.app/#/app';
const FETCH_CONCURRENCY = 3;

// Papel esperado por posição no fluxo de aprovação + prazo (dias).
const PAPEIS = [
  { nome: 'Supervisor da Obra',    prazoDias: 1 },
  { nome: 'Gerente do Contrato',   prazoDias: 2 },
  { nome: 'Cliente / Fiscalização', prazoDias: 7 },
];

export default async function handler(req, res) {
  // ── Autorização ────────────────────────────────────────────────
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.authorization || '';
    const qsSecret = (req.query && req.query.secret) || '';
    const ok = auth === `Bearer ${secret}` || qsSecret === secret;
    if (!ok) {
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

  // Aceita tanto os nomes do Vercel KV (KV_REST_API_*) quanto os do
  // Upstash direto (UPSTASH_REDIS_REST_*), pois o Vercel migrou o KV
  // para o marketplace do Upstash e o prefixo injetado varia.
  const kvUrl   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const kvOk    = !!(kvUrl && kvToken);
  const sendReal   = process.env.NOTIFY_ENABLED === 'true' && kvOk
                     && !!process.env.RESEND_API_KEY;
  const dryRun     = !sendReal;

  const base = (process.env.DIARIO_API_BASE || DEFAULT_BASE).replace(/\/+$/, '');
  const api  = (path, params = {}) => diarioGet(base, empresaId, apiKey, path, params);

  const resultado = {
    dryRun,
    kvConfigurado: kvOk,
    resendConfigurado: !!process.env.RESEND_API_KEY,
    notificacoes: [],
    enviados: 0,
    jaNotificados: 0,
    erros: [],
  };

  try {
    const obrasData = await api('/obras', { grupoObra: true });
    const obras = (obrasData.obras || []).filter((o) => o?.status?.id === 3);

    for (const obra of obras) {
      // So os RDOs aguardando aprovacao — conjunto menor, evita o rate
      // limit da API. Fallback para a listagem recente se o endpoint falhar.
      let ids = [];
      try {
        const aguardando = await api(`/obras/${obra._id}/relatorios-aguardando-aprovacao`);
        const lista = Array.isArray(aguardando)
          ? aguardando
          : (aguardando.relatorios || aguardando.data || aguardando.aguardando || []);
        ids = lista.map((r) => r._id || r.id).filter(Boolean);
      } catch {
        const listagem = await api(`/obras/${obra._id}/relatorios`, { limite: 60, ordem: 'desc' });
        const rdos = Array.isArray(listagem) ? listagem : (listagem.relatorios || listagem.data || []);
        ids = rdos.map((r) => r._id).filter(Boolean);
      }

      // Busca detalhe (com concorrência limitada) para ler as assinaturas.
      const detalhes = await pMap(
        ids,
        (id) => api(`/obras/${obra._id}/relatorios/${id}`).catch(() => null),
        FETCH_CONCURRENCY,
      );

      for (const rdo of detalhes) {
        if (!rdo) continue;
        const assinaturas = rdo.assinaturasEletronicaUrl || [];
        const idxProximo = assinaturas.findIndex((a) => a?.proximoAprovar === true);
        if (idxProximo < 0) continue; // ninguém na fila (concluído ou preenchendo)

        const proximo = assinaturas[idxProximo];
        const email   = proximo?.usuarioEmail;
        if (!email) continue;

        const papel = PAPEIS[idxProximo] || { nome: `Aprovador ${idxProximo + 1}`, prazoDias: 7 };
        const dedupKey = `notif:${rdo._id}:${idxProximo}`;

        // Já notificado?
        if (kvOk && (await kvGet(kvUrl, kvToken, dedupKey))) {
          resultado.jaNotificados++;
          continue;
        }

        const anterior = idxProximo > 0 ? assinaturas[idxProximo - 1] : null;
        const payload = montarEmail({ obra, rdo, proximo, anterior, papel });

        const registro = {
          rdoId: rdo._id,
          numero: rdo.numero,
          obra: obra.nome,
          para: email,
          papel: papel.nome,
        };

        if (dryRun) {
          resultado.notificacoes.push({ ...registro, acao: 'dry-run' });
          continue;
        }

        try {
          await enviarResend(email, payload);
          if (kvOk) await kvSet(kvUrl, kvToken, dedupKey, '1');
          resultado.enviados++;
          resultado.notificacoes.push({ ...registro, acao: 'enviado' });
        } catch (err) {
          resultado.erros.push({ ...registro, erro: err.message });
        }
      }
    }

    res.status(200).json(resultado);
  } catch (err) {
    console.error('[notificar] Exceção:', err);
    res.status(500).json({ error: 'Erro na varredura', detail: err.message, parcial: resultado });
  }
}

// ── E-mail ─────────────────────────────────────────────────────────
function montarEmail({ obra, rdo, proximo, anterior, papel }) {
  const dashUrl = (process.env.NOTIFY_DASHBOARD_URL || '').replace(/\/+$/, '');
  const linkRdo = `${WEB_BASE}/obras/${obra._id}/relatorios/${rdo._id}`;
  const numero  = rdo.numero != null ? `#${rdo.numero}` : '';
  const quemAntes = anterior
    ? `${anterior.usuarioNome || 'O aprovador anterior'} aprovou em ${anterior.dataHora || '—'}.`
    : 'O RDO foi emitido e está pronto para sua análise.';

  const subject = `RDO ${numero} aguarda sua aprovação — ${obra.nome}`;

  const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1c1c1c">
  <div style="background:#2b2b2b;padding:20px 24px;border-bottom:4px solid #cf2927">
    <span style="color:#fff;font-size:20px;font-weight:bold;letter-spacing:.5px">SISTENGE</span>
    <span style="color:#cf2927;font-size:20px;font-weight:bold"> · RDO</span>
  </div>
  <div style="padding:24px">
    <p style="font-size:16px;margin:0 0 4px">Olá, ${escapeHtml(proximo.usuarioNome || '')}.</p>
    <p style="font-size:15px;line-height:1.6;margin:12px 0">
      O <strong>RDO ${numero}</strong> da obra <strong>${escapeHtml(obra.nome)}</strong>
      está aguardando <strong>sua aprovação</strong> como <strong>${escapeHtml(papel.nome)}</strong>.
    </p>
    <p style="font-size:14px;line-height:1.6;color:#555;margin:12px 0">
      ${escapeHtml(quemAntes)}<br/>
      Data do RDO: <strong>${escapeHtml(rdo.data || '—')}</strong> ·
      Prazo recomendado: <strong>D+${papel.prazoDias}</strong>.
    </p>
    <p style="margin:24px 0">
      <a href="${linkRdo}" style="background:#cf2927;color:#fff;text-decoration:none;
         padding:12px 22px;border-radius:6px;font-weight:bold;display:inline-block">
        Abrir e aprovar o RDO
      </a>
    </p>
    ${dashUrl ? `<p style="font-size:13px;color:#777;margin:12px 0">
      Acompanhe os indicadores em <a href="${dashUrl}" style="color:#cf2927">${dashUrl}</a>.
    </p>` : ''}
    <hr style="border:none;border-top:1px solid #e3e3e8;margin:20px 0"/>
    <p style="font-size:12px;color:#999;margin:0">
      Mensagem automática do Dashboard KPI RDO — Sistenge Construções e Comércio Ltda.
      Não responda este e-mail.
    </p>
  </div>
</div>`.trim();

  const text = `Olá, ${proximo.usuarioNome || ''}.

O RDO ${numero} da obra ${obra.nome} aguarda sua aprovação como ${papel.nome}.
${quemAntes}
Data do RDO: ${rdo.data || '—'} · Prazo recomendado: D+${papel.prazoDias}.

Abrir e aprovar: ${linkRdo}

— Mensagem automática do Dashboard KPI RDO (Sistenge). Não responda.`;

  return { subject, html, text };
}

async function enviarResend(to, { subject, html, text }) {
  const from = process.env.NOTIFY_FROM || 'RDO Sistenge <onboarding@resend.dev>';
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`Resend ${resp.status}: ${body}`);
  }
  return resp.json();
}

// ── Vercel KV (REST / Upstash) ──────────────────────────────────────
async function kvGet(baseUrl, token, key) {
  const url = `${baseUrl}/get/${encodeURIComponent(key)}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) return null;
  const data = await r.json();
  return data?.result ?? null;
}

async function kvSet(baseUrl, token, key, value) {
  // TTL de 180 dias — evita crescer o store indefinidamente.
  const url = `${baseUrl}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}?EX=15552000`;
  await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
}

// ── Chamada à API do diariodeobra (server-side, mesmo padrão do proxy) ──
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function diarioGet(base, empresaId, apiKey, path, params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)),
  ).toString();
  const target = `${base}/empresas/${empresaId}${path}${qs ? '?' + qs : ''}`;

  // Retry com backoff em 429 (limite por minuto da API).
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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
