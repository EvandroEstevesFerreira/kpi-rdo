const MANUAL_URL = '/manuais/manual-rdo-completo.html';

export default function Treinamento() {
  return (
    <div className="treinamento-wrap">
      <div className="manual-meta">
        <span className="badge-corp">Uso Interno — Departamento de Engenharia</span>
        <span className="manual-versao">v2 — Maio/2026</span>
        <span className="manual-sistema">Sistema: diariodeobras.net</span>
        <a
          className="manual-link-completo"
          href={MANUAL_URL}
          target="_blank"
          rel="noreferrer"
        >
          📄 Abrir em nova aba
        </a>
      </div>

      <iframe
        src={MANUAL_URL}
        title="Manual de Preenchimento do RDO"
        className="manual-iframe"
      />
    </div>
  );
}
