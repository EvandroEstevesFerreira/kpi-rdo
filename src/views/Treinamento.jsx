const MANUAL_URL = '/manuais/manual-rdo-completo.html';

export default function Treinamento() {
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
        src={MANUAL_URL}
        title="Manual de Preenchimento do RDO"
        className="manual-iframe"
      />
    </div>
  );
}
