import { useState, useRef, useEffect } from 'react';

/**
 * Botão "i" circular que abre um popover com detalhes do KPI.
 * Usa toggle por clique (não hover) — funciona em mobile e
 * evita fechar acidentalmente ao mover o mouse.
 */
export default function InfoPopover({ info }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  if (!info) return null;

  return (
    <span className="info-pop" ref={ref}>
      <button
        type="button"
        className="info-btn"
        aria-label={`Sobre ${info.titulo}`}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
      >i</button>

      {open && (
        <div className="info-panel" role="dialog">
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
