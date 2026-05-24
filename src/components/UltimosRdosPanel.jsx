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
        {rdos.map((r) => (
          <div key={r.id} className="ultimo-rdo-row">
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
              {r.linkPdf && (
                <a
                  href={r.linkPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rdo-pdf"
                  title="Abrir PDF do RDO"
                >
                  📄 PDF
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function labelStatus(s) {
  if (s === 'aprovado') return 'Aprovado';
  if (s === 'parcial')  return 'Em aprovação';
  return 'Pendente';
}
