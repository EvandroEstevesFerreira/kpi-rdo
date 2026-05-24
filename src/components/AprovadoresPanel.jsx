export default function AprovadoresPanel({ ranking }) {
  if (!ranking?.length) {
    return (
      <div className="panel">
        <h2>Ranking de Aprovadores</h2>
        <p style={{ color: '#6b6b6b', fontSize: 13 }}>
          Nenhuma aprovação registrada no período.
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Ranking de Aprovadores</h2>
      <p className="panel-sub">
        Ordenado pelos que mais demoram. Prazo varia por papel
        (Supervisor D+1, Gerente D+2, Cliente D+7).
      </p>
      <div className="aprovadores-table-wrap">
        <table className="aprovadores-table">
          <thead>
            <tr>
              <th>Aprovador</th>
              <th>Papel</th>
              <th className="num">Aprovações</th>
              <th className="num">Tempo médio</th>
              <th className="num">No prazo</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((u, i) => (
              <tr key={`${u.nome}-${u.papel}-${i}`}>
                <td>
                  <div className="aprov-nome">{u.nome}</div>
                  {u.cargo && <div className="aprov-cargo">{u.cargo}</div>}
                </td>
                <td>{u.papel}</td>
                <td className="num">{u.total}</td>
                <td className="num">
                  <span className={tempoBadgeClass(u.tempoMedio, u.papel)}>
                    {formatTempo(u.tempoMedio)}
                  </span>
                </td>
                <td className="num">
                  <span className={prazoBadgeClass(u.taxaPrazo)}>
                    {u.taxaPrazo}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatTempo(dias) {
  if (dias < 1) return `${Math.round(dias * 24)}h`;
  return `${dias.toFixed(1)}d`;
}

function tempoBadgeClass(dias, papel) {
  const limite = papel.startsWith('Supervisor') ? 1 : papel.startsWith('Gerente') ? 2 : 7;
  if (dias <= limite) return 'badge ok';
  if (dias <= limite * 1.5) return 'badge warn';
  return 'badge bad';
}

function prazoBadgeClass(taxa) {
  if (taxa >= 90) return 'badge ok';
  if (taxa >= 70) return 'badge warn';
  return 'badge bad';
}
