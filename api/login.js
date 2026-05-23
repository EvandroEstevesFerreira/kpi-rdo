// POST /api/login { senha } -> seta cookie kpi-auth assinado (HMAC).
// Valido por SESSAO_HORAS (default 8h).

const SESSAO_HORAS = 8;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Metodo nao permitido' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const senha = body?.senha;

  const esperada = process.env.KPI_AUTH_PASSWORD;
  const secret   = process.env.KPI_AUTH_SECRET;

  if (!esperada || !secret) {
    console.error('[login] KPI_AUTH_PASSWORD ou KPI_AUTH_SECRET nao configurados');
    return res.status(500).json({ error: 'Servidor de auth nao configurado' });
  }

  if (typeof senha !== 'string' || senha.length === 0 || senha !== esperada) {
    // Pequeno delay constante reduz timing-attacks rasos
    await new Promise((r) => setTimeout(r, 200));
    return res.status(401).json({ error: 'Senha invalida' });
  }

  const exp     = Date.now() + SESSAO_HORAS * 60 * 60 * 1000;
  const payload = btoa(JSON.stringify({ exp }));
  const sig     = await hmacHex(payload, secret);
  const token   = `${payload}.${sig}`;

  const maxAge = SESSAO_HORAS * 60 * 60;
  res.setHeader(
    'Set-Cookie',
    `kpi-auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  );
  return res.status(200).json({ ok: true });
}

async function hmacHex(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
