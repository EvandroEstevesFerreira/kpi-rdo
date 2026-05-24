import { useEffect, useRef } from 'react';

const MANUAL_URL = '/manuais/manual-rdo-completo.html';

export default function Treinamento() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let ro = null;

    const resize = () => {
      const doc = iframe.contentDocument;
      if (!doc?.documentElement) return;
      const h = Math.max(
        doc.documentElement.scrollHeight,
        doc.body?.scrollHeight || 0
      );
      iframe.style.height = `${h}px`;
    };

    const onLoad = () => {
      resize();
      try {
        if (typeof ResizeObserver !== 'undefined') {
          ro = new ResizeObserver(resize);
          if (iframe.contentDocument?.body) {
            ro.observe(iframe.contentDocument.body);
          }
        }
        iframe.contentWindow?.addEventListener('load', resize);
        const imgs = iframe.contentDocument?.images || [];
        for (const img of imgs) {
          if (!img.complete) img.addEventListener('load', resize, { once: true });
        }
      } catch (e) {
        console.warn('[Treinamento] auto-resize listener falhou', e);
      }
    };

    iframe.addEventListener('load', onLoad);
    window.addEventListener('resize', resize);

    return () => {
      iframe.removeEventListener('load', onLoad);
      window.removeEventListener('resize', resize);
      ro?.disconnect();
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

      <iframe
        ref={iframeRef}
        src={MANUAL_URL}
        title="Manual de Preenchimento do RDO"
        className="manual-iframe"
        scrolling="no"
      />
    </div>
  );
}
