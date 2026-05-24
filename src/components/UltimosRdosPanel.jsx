export default function UltimosRdosPanel({ rdos, mostrarObra = false }) {
  if (!rdos?.length) {
    return (
      <div className="panel">
        <h2>Últimos RDOs</h2>
        <p style={{ color: '#6b6b6b', fontSize: 13 }}>
          Nenhum RDO no período.
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Últimos RDOs</h2>
      <div className="ultimos-rdos">
        {rdos.map((r) => {
          const href = r.linkPdf || r.linkWeb || null;
          const Tag  = href ? 'a' : 'div';
          const linkProps = href
            ? { href, target: '_blank', rel: 'noopener noreferrer' }
            : {};
          return (
            <Tag
              key={r.id}
              className={`ultimo-rdo-row ${href ? 'is-link' : ''}`}
              {...linkProps}
              title={href ? 'Abrir RDO no diariodeobra.app' : undefined}
            >
              <div className="rdo-info">
                <span className="rdo-numero">#{r.numero ?? '—'}</span>
                <span className="rdo-data">{r.data}</span>
                {mostrarObra && r.obraNome && (
                  <span className="rdo-obra">{r.obraNome}</span>
                )}
              </div>
              <div className="rdo-meta">
                <span className={`rdo-status status-${r.statusAprovacao}`}>
                  {labelStatus(r.statusAprovacao)}
                </span>
                <span className="rdo-fotos">📷 {r.totalFotos}</span>
                {href && (
                  <span className="rdo-abrir">
                    {r.linkPdf ? '📄 PDF' : '🔗 Abrir'} ↗
                  </span>
                )}
              </div>
            </Tag>
          );
        })}
      </div>
    </div>
  );
}

function labelStatus(s) {
  if (s === 'aprovado') return 'Aprovado';
  if (s === 'parcial')  return 'Em aprovação';
  return 'Pendente';
}
