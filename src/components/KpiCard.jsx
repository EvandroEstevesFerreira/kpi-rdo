// Determina o status (ok/warn/crit) com base no valor vs meta
const classificar = (valor, meta, invertido = false) => {
  if (valor == null) return 'warn';
  if (invertido) {
    if (valor <= meta) return 'ok';
    if (valor <= meta * 1.5) return 'warn';
    return 'crit';
  }
  if (valor >= meta) return 'ok';
  if (valor >= meta * 0.85) return 'warn';
  return 'crit';
};

export default function KpiCard({
  label,
  valor,
  unidade = '%',
  meta,
  invertido = false,
  metaLabel,
}) {
  const status = meta != null ? classificar(valor, meta, invertido) : null;
  const dotClass = status === 'ok' ? 'dot-ok' : status === 'warn' ? 'dot-warn' : 'dot-crit';

  return (
    <div className="kpi-card">
      {status && <span className={`status-dot ${dotClass}`} />}
      <span className="label">{label}</span>
      <span className="value">
        {valor != null ? valor : '—'}
        {valor != null && unidade && <span style={{ fontSize: 18, color: '#6b6b6b', marginLeft: 2 }}>{unidade}</span>}
      </span>
      {meta != null && (
        <span className="meta">
          Meta: {metaLabel ?? `${invertido ? '≤ ' : '≥ '}${meta}${unidade}`}
        </span>
      )}
    </div>
  );
}
