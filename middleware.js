// Vercel Edge Middleware — protege todo o site com senha compartilhada.
// Roda em TODA request antes das functions/static assets, exceto as
// rotas excluidas no matcher abaixo.

export const config = {
  matcher: [
    // Exclui: /login (pagina e endpoint), assets de logo/favicon e
    // arquivos do Vite (/assets/*, /favicon, etc.)
    '/((?!login\\.html|api/login|sistenge-logo|favicon|assets/).*)',
  ],
};

export default async function middleware(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match  = cookieHeader.match(/(?:^|;\s*)kpi-auth=([^;]+)/);
  const token  = match?.[1];

  if (token && (await verificarToken(token))) {
    return; // sessao valida — segue o fluxo
  }

  // Sem sessao valida -> redireciona para /login.html
  const url = new URL(request.url);
  url.pathname = '/login.html';
  // Preserva o destino original em ?next=...
  url.searchParams.set('next', new URL(request.url).pathname + new URL(request.url).search);
  return Response.redirect(url, 307);
}

async function verificarToken(token) {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return false;

    const secret = globalThis.process?.env?.KPI_AUTH_SECRET;
    if (!secret) return false;

    const esperado = await hmacHex(payload, secret);
    if (!constantTimeEqual(esperado, sig)) return false;

    const dados = JSON.parse(atob(payload));
    if (typeof dados.exp !== 'number' || dados.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
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

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
