// Vercel Serverless Function — proxy seguro para a API do diariodeobra.app
// A DIARIO_API_KEY fica somente no servidor, nunca exposta ao browser

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.status(200).end();
    return;
  }

  // O rewrite em vercel.json (/api/diario/:path* -> /api/diario/proxy)
  // injeta o segmento capturado como req.query.path. Precisamos separar
  // esse capturado da query string original que o cliente enviou.
  const { path: capturedPath, ...clientQuery } = req.query || {};

  // capturedPath pode vir como string ("obras") ou array (["obras","123","relatorios"])
  const pathSegment = Array.isArray(capturedPath)
    ? capturedPath.join('/')
    : (capturedPath || '');

  const apiPath = pathSegment ? `/${pathSegment}` : '';
  const qs      = new URLSearchParams(clientQuery).toString();
  const target  = `https://api.diariodeobra.app/v1${apiPath}${qs ? '?' + qs : ''}`;

  console.log(`[proxy] -> ${req.method} ${target}`);

  try {
    const upstream = await fetch(target, {
      method:  req.method,
      headers: {
        'Authorization': `Bearer ${process.env.DIARIO_API_KEY}`,
        'Content-Type':  'application/json',
        'Accept':        'application/json',
      },
    });

    if (!upstream.ok) {
      const body = await upstream.text();
      console.error(`[proxy] Erro ${upstream.status}:`, body);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(upstream.status).json({
        error:  `API retornou ${upstream.status}`,
        detail: body,
        target,
      });
      return;
    }

    const data = await upstream.json();

    // Cache de 5 minutos no CDN da Vercel (reduz chamadas à API)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);

  } catch (err) {
    console.error('[proxy] Exceção:', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({
      error:  'Erro interno no proxy',
      detail: err.message,
    });
  }
}
