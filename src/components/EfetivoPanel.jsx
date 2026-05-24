import { useState } from 'react';

/**
 * Painel "Efetivo do Período" — mostra a média diária de pessoal e
 * permite expandir o detalhe por função e por categoria (MOD/MOI/Terceiros).
 */
export default function EfetivoPanel({ efetivo, dias }) {
  const [tab, setTab] = useState('funcao'); // 'funcao' | 'categoria'

  if (!efetivo) return null;

  const { mediaDiaria, diasComEfetivo, porFuncao, porCategoria } = efetivo;

  if (!diasComEfetivo) {
    return (
      <div className="panel">
        <h2>Efetivo do período</h2>
        <p style={{ color: '#6b6b6b', fontSize: 13 }}>
          Nenhum RDO no período tem mão de obra registrada.
        </p>
      </div>
    );
  }

  return (
    <div className="panel efetivo-panel">
      <div className="panel-head">
        <h2>Efetivo do período</h2>
        <span className="panel-sub">
          Últimos {dias} dias · {diasComEfetivo} RDOs com efetivo
        </span>
        <a
          className="panel-ext-link"
          href="https://web.diariodeobra.app/#/app/analise-de-dados/mao-de-obra/histograma"
          target="_blank"
          rel="noopener noreferrer"
        >
          Histograma completo ↗
        </a>
      </div>

      <div className="efetivo-resumo">
        <div className="efetivo-media">
          <span className="efetivo-num">{mediaDiaria}</span>
          <span className="efetivo-label">pessoas/dia (média)</span>
        </div>
        <div className="efetivo-stats">
          <Stat valor={porFuncao.length} label="Funções diferentes" />
          <Stat valor={porCategoria.length} label="Categorias" />
        </div>
      </div>

      <div className="efetivo-tabs">
        <button
          className={`efetivo-tab ${tab === 'funcao' ? 'active' : ''}`}
          onClick={() => setTab('funcao')}
        >
          Por função
        </button>
        <button
          className={`efetivo-tab ${tab === 'categoria' ? 'active' : ''}`}
          onClick={() => setTab('categoria')}
        >
          Por categoria
        </button>
      </div>

      {tab === 'funcao'    && <TabelaFuncao   funcoes={porFuncao} max={mediaDiaria} />}
      {tab === 'categoria' && <TabelaCategoria categorias={porCategoria} max={mediaDiaria} />}
    </div>
  );
}

function Stat({ valor, label }) {
  return (
    <div className="efetivo-stat">
      <span>{valor}</span>
      <small>{label}</small>
    </div>
  );
}

function TabelaFuncao({ funcoes, max }) {
  return (
    <div className="efetivo-tabela">
      {funcoes.map((f) => (
        <Linha
          key={f.funcao}
          titulo={f.funcao}
          subtitulo={f.categoria}
          valor={f.mediaPorDia}
          totalPD={f.totalPessoasDias}
          max={Math.max(max, 1)}
        />
      ))}
    </div>
  );
}

function TabelaCategoria({ categorias, max }) {
  return (
    <div className="efetivo-tabela">
      {categorias.map((c) => (
        <Linha
          key={c.categoria}
          titulo={c.categoria}
          valor={c.mediaPorDia}
          totalPD={c.totalPessoasDias}
          max={Math.max(max, 1)}
        />
      ))}
    </div>
  );
}

function Linha({ titulo, subtitulo, valor, totalPD, max }) {
  const pct = Math.min(100, (valor / max) * 100);
  return (
    <div className="efetivo-linha">
      <div className="efetivo-linha-info">
        <span className="efetivo-linha-titulo">{titulo}</span>
        {subtitulo && <span className="efetivo-linha-sub">{subtitulo}</span>}
      </div>
      <div className="efetivo-linha-bar">
        <div className="efetivo-linha-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="efetivo-linha-valor">
        <strong>{valor}</strong>
        <small>{totalPD} p·dia</small>
      </div>
    </div>
  );
}
