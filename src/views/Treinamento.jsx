// Pagina de treinamento — estrutura placeholder.
// Substituir o array SECOES com o conteudo real quando o usuario enviar.

const SECOES = [
  {
    id: 'intro',
    titulo: 'Bem-vindo',
    conteudo: (
      <>
        <p>
          Este dashboard consolida em tempo real os indicadores do
          Relatório Diário de Obra (RDO) das obras ativas da Sistenge,
          consumindo a API do <strong>diariodeobra.app</strong>.
        </p>
        <p>
          Use o menu lateral para alternar entre obras. Cada KPI tem um
          botão <span className="kbd">i</span> que abre uma descrição
          detalhada com a fórmula e as faixas de tolerância.
        </p>
      </>
    ),
  },
  {
    id: 'fluxo-rdo',
    titulo: 'Fluxo de aprovação do RDO',
    conteudo: (
      <>
        <p>O RDO percorre quatro etapas:</p>
        <ol>
          <li><strong>D+0 — Responsável operacional</strong> cria o RDO até 17h30</li>
          <li><strong>D+1 — Supervisor da obra</strong> aprova até 12h do dia seguinte</li>
          <li><strong>D+2 — Gerente do contrato</strong> aprova até 17h do segundo dia</li>
          <li><strong>D+7 — Cliente / Fiscalização</strong> aprova em até 7 dias</li>
        </ol>
        <p className="nota">
          KPIs como "Aprovação D+1/D+2/D+7" medem o % de RDOs aprovados
          dentro do prazo correspondente.
        </p>
      </>
    ),
  },
  {
    id: 'placeholder',
    titulo: 'Manual de usabilidade',
    conteudo: (
      <>
        <p className="nota">
          📝 O material completo de treinamento e usabilidade do sistema
          ainda será adicionado aqui pelo administrador.
        </p>
        <p>
          Se você é o responsável pelo conteúdo, edite
          <code> src/views/Treinamento.jsx </code>
          e adicione as seções com texto, imagens ou vídeos embedados.
        </p>
      </>
    ),
  },
];

export default function Treinamento() {
  return (
    <div className="treinamento">
      <aside className="treinamento-toc">
        <h3>Tópicos</h3>
        <ul>
          {SECOES.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.titulo}</a>
            </li>
          ))}
        </ul>
      </aside>

      <article className="treinamento-content">
        {SECOES.map((s) => (
          <section key={s.id} id={s.id} className="treinamento-secao">
            <h2>{s.titulo}</h2>
            {s.conteudo}
          </section>
        ))}
      </article>
    </div>
  );
}
