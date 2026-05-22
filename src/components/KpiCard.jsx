import InfoPopover from './InfoPopover';

const classificar = (valor, info) => {
  if (valor == null || info?.meta == null) return null;
  const { meta, invertido } = info;
  if (invertido) {
    if (valor <= meta)        return 'ok';
    if (valor <= meta * 2)    return 'warn';
    return 'crit';
  }
  if (valor >= meta)          return 'ok';
  if (valor >= meta * 0.85)   return 'warn';
  return 'crit';
};

export default function KpiCard({ label, valor, unidade, info, metaLabel }) {
  const status = info ? classificar(valor, info) : null;
  const dotClass =
    status === 'ok' ? 'dot-ok' :
    status === 'warn' ? 'dot-warn' :
    status === 'crit' ? 'dot-crit' : '';

  const un = unidade ?? info?.unidade ?? '';

  return (
    <div className="kpi-card">
      {status && <span className={`status-dot ${dotClass}`} />}

      <div className="kpi-head">
        <span className="label">{label}</span>
        <InfoPopover info={info} />
      </div>

      <span className="value">
        {valor != null ? valor : '—'}
        {valor != null && un && (
          <span style={{ fontSize: 18, color: '#6b6b6b', marginLeft: 2 }}>{un}</span>
        )}
      </span>

      {info?.meta != null && (
        <span className="meta">
          Meta: {metaLabel ?? `${info.invertido ? '≤ ' : '≥ '}${info.meta}${un}`}
        </span>
      )}
    </div>
  );
}
