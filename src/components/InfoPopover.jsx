import { useState, useRef, useEffect, useLayoutEffect } from 'react';

/**
 * Botão "i" que abre um popover com detalhes do KPI.
 * O popover é renderizado dentro do mesmo subtree, mas com posicionamento
 * absoluto ajustado dinamicamente para nunca sair da viewport
 * (flipa horizontalmente se cortar à direita; ajusta verticalmente
 *  se passar do final da tela).
 */
export default function InfoPopover({ info }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 24, left: 0, right: 'auto' });
  const wrapRef  = useRef(null);
  const panelRef = useRef(null);

  // Fecha por clique fora / Esc
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  // Reposiciona quando abre — checa se cabe à direita do botão; se não, flipa
  useLayoutEffect(() => {
    if (!open || !panelRef.current || !wrapRef.current) return;
    const wrap   = wrapRef.current.getBoundingClientRect();
    const panel  = panelRef.current.getBoundingClientRect();
    const vw     = window.innerWidth;
    const MARGEM = 12;

    // Por padrão, extende para a direita do botão
    const espacoDireita  = vw - wrap.left - MARGEM;
    const espacoEsquerda = wrap.right - MARGEM;

    let next;
    if (panel.width <= espacoDireita) {
      next = { top: 24, left: 0, right: 'auto' };
    } else if (panel.width <= espacoEsquerda) {
      next = { top: 24, right: 0, left: 'auto' };
    } else {
      // Não cabe nem de um lado nem de outro — centraliza usando viewport
      const left = Math.max(
        MARGEM - wrap.left,
        Math.min(0, vw - wrap.left - panel.width - MARGEM)
      );
      next = { top: 24, left, right: 'auto' };
    }
    setPos(next);
  }, [open]);

  if (!info) return null;

  return (
    <span className="info-pop" ref={wrapRef}>
      <button
        type="button"
        className="info-btn"
        aria-label={`Sobre ${info.titulo}`}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
      >i</button>

      {open && (
        <div
          ref={panelRef}
          className="info-panel"
          role="dialog"
          style={{ top: pos.top, left: pos.left, right: pos.right }}
        >
          <h4>{info.titulo}</h4>
          <p>{info.descricao}</p>

          {info.formula && (
            <div className="info-row">
              <span className="info-label">Cálculo</span>
              <code>{info.formula}</code>
            </div>
          )}

          {info.meta != null && (
            <div className="info-row">
              <span className="info-label">Meta</span>
              <span>
                {info.invertido ? '≤ ' : '≥ '}
                {info.meta}{info.unidade}
              </span>
            </div>
          )}

          {info.bandas && (
            <div className="info-bands">
              {info.bandas.map((b, i) => (
                <div key={i} className={`info-band band-${b.status}`}>
                  <span className="band-dot" />
                  {b.label}
                </div>
              ))}
            </div>
          )}

          {info.impacto && (
            <p className="info-impact">{info.impacto}</p>
          )}
        </div>
      )}
    </span>
  );
}
