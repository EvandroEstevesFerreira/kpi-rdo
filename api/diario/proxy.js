// Vercel Serverless Function — proxy seguro para a API do diariodeobra.app
// A DIARIO_API_KEY (JWT no header `Token`) fica somente no servidor.

const DEFAULT_BASE = 'https://api.diariodeobra.app/v2';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.status(200).end();
    return;
  }

  // O rewrite em vercel.json (/api/diario/:path* -> /api/diario/proxy)
  // injeta o segmento capturado como req.query.path
  const { path: capturedPath, ...clientQuery } = req.query || {};
  const pathSegment = Array.isArray(capturedPath)
    ? capturedPath.join('/')
    : (capturedPath || '');

  // Base + empresaId vêm de env vars (não dá pra hardcodar — empresaId
  // é específico de cada cliente do diariodeobra.app)
  const base      = (process.env.DIARIO_API_BASE || DEFAULT_BASE).replace(/\/+$/, '');
  const empresaId = process.env.DIARIO_EMPRESA_ID;
  if (!empresaId) {
    res.status(500).json({ error: 'DIARIO_EMPRESA_ID não configurado no servidor' });
    return;
  }

  const apiPath = pathSegment ? `/${pathSegment}` : '';
  const qs      = new URLSearchParams(clientQuery).toString();
  const target  = `${base}/empresas/${empresaId}${apiPath}${qs ? '?' + qs : ''}`;

  console.log(`[proxy] -> ${req.method} ${target}`);

  try {
    const upstream = await fetch(target, {
      method:  req.method,
      headers: {
        // Autenticação: a API do diariodeobra.app usa header `Token`
        // (NÃO `Authorization: Bearer`)
        'Token':         process.env.DIARIO_API_KEY,
        'App-Iss':       'app-web',
        'Accept':        'application/json',
        'Content-Type':  'application/json',
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
