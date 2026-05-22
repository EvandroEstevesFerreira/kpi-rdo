import { useState } from 'react';
import ManualRDO from './treinamento/ManualRDO';
import ManualCadastros from './treinamento/ManualCadastros';

const MANUAIS = {
  rdo: {
    titulo: 'Manual de Preenchimento do RDO',
    versao: 'v1.1 — Maio/2026',
    classificacao: 'Uso Interno — Departamento de Engenharia',
    componente: ManualRDO,
    secoes: [
      { id: 'objetivo',          titulo: '01 · Objetivo & Contexto' },
      { id: 'responsabilidades', titulo: '02 · Responsabilidades' },
      { id: 'fluxo',             titulo: '03 · Fluxo de Aprovação' },
      { id: 'campos',            titulo: '04 · Campos do Sistema' },
      { id: 'padrao-escrita',    titulo: '05 · Padrão de Escrita' },
      { id: 'roteiro',           titulo: '06 · Roteiro de Ocorrências' },
      { id: 'faca-naofaca',      titulo: '07 · Faça / Não Faça' },
      { id: 'fotografia',        titulo: '08 · Fotografia de Obra' },
      { id: 'prazos',            titulo: '09 · Prazos Críticos' },
      { id: 'checklist',         titulo: '10 · Checklist Diário' },
      { id: 'riscos',            titulo: '11 · Riscos & Penalidades' },
      { id: 'treinamento-rdo',   titulo: '12 · Treinamento' },
    ],
  },
  cadastros: {
    titulo: 'Manual de Implementação dos Cadastros',
    versao: 'v1.0 — Maio/2026',
    classificacao: 'Uso Interno — Depto. de Engenharia',
    componente: ManualCadastros,
    secoes: [
      { id: 'visao-geral',  titulo: '01 · Visão Geral' },
      { id: 'mao-de-obra',  titulo: '02 · Mão de Obra' },
      { id: 'equipamentos', titulo: '03 · Equipamentos' },
      { id: 'ocorrencias',  titulo: '04 · Tipos de Ocorrências' },
      { id: 'tarefas',      titulo: '05 · Lista de Tarefas' },
      { id: 'ordem',        titulo: '06 · Ordem de Implementação' },
      { id: 'links',        titulo: '07 · Links de Treinamento' },
    ],
  },
};

export default function Treinamento() {
  const [manual, setManual] = useState('rdo');
  const cur = MANUAIS[manual];
  const Conteudo = cur.componente;

  return (
    <div className="treinamento-wrap">
      <div className="manual-tabs">
        {Object.entries(MANUAIS).map(([key, m]) => (
          <button
            key={key}
            className={`manual-tab ${manual === key ? 'active' : ''}`}
            onClick={() => setManual(key)}
          >
            {m.titulo}
          </button>
        ))}
      </div>

      <div className="manual-meta">
        <span className="badge-corp">{cur.classificacao}</span>
        <span className="manual-versao">{cur.versao}</span>
        <span className="manual-sistema">Sistema: diariodeobras.net</span>
      </div>

      <div className="treinamento">
        <aside className="treinamento-toc">
          <h3>Sumário</h3>
          <ul>
            {cur.secoes.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.titulo}</a>
              </li>
            ))}
          </ul>
        </aside>

        <article className="treinamento-content">
          <Conteudo />
        </article>
      </div>
    </div>
  );
}
