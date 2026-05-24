import { useEffect, useRef, useState } from 'react';

const MANUAL_URL = '/manuais/manual-rdo-completo.html';

const OVERRIDES = `
  :host { display: block; }
  body { margin: 0; }
  /* A capa originalmente tinha min-height: 100vh, o que deixava 1 tela
     inteira preta antes do conteudo quando incorporado no dashboard. */
  .cover { min-height: auto !important; }
`;

export default function Treinamento() {
  const hostRef = useRef(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
    let cancelado = false;

    fetch(MANUAL_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((html) => {
        if (cancelado) return;
        const doc = new DOMParser().parseFromString(html, 'text/html');
        // ':root' nao casa nada dentro de shadow DOM. Trocamos por ':host'
        // para que as custom properties (--red, --cover-bg, etc) sejam
        // aplicadas ao shadow host e cascateiem pra todo o conteudo.
        const styles = Array.from(doc.querySelectorAll('style'))
          .map((s) => s.textContent.replace(/:root\b/g, ':host'))
          .join('\n');
        const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'))
          .map((l) => `<link rel="stylesheet" href="${l.getAttribute('href')}">`)
          .join('');
        const bodyHtml = doc.body.innerHTML;

        shadow.innerHTML =
          `${links}<style>${styles}\n${OVERRIDES}</style>${bodyHtml}`;
      })
      .catch((e) => {
        if (cancelado) return;
        setErro(e.message);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className="treinamento-wrap">
      <a
        className="manual-open-tab"
        href={MANUAL_URL}
        target="_blank"
        rel="noreferrer"
        title="Abrir em nova aba"
      >
        <span aria-hidden="true">↗</span>
        <span className="manual-open-tab-label">Abrir em nova aba</span>
      </a>

      {erro ? (
        <div className="manual-erro">
          Falha ao carregar manual: {erro}
        </div>
      ) : (
        <div ref={hostRef} className="manual-host" />
      )}
    </div>
  );
}
