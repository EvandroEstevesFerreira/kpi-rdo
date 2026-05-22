const ICONS = {
  danger: '!',
  warn:   '⚠',
  info:   'i',
};

export default function AlertCard({ tipo = 'info', msg }) {
  return (
    <div className={`alert alert-${tipo}`}>
      <span className="alert-icon">{ICONS[tipo] || 'i'}</span>
      <span>{msg}</span>
    </div>
  );
}
