import { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar,
} from 'recharts';
import { useDiarioKPIs, CONSOLIDADO_ID } from './hooks/useDiarioKPIs';
import Logo from './components/Logo';
import KpiCard from './components/KpiCard';
import AlertCard from './components/AlertCard';
import Gauge from './components/Gauge';
import InfoPopover from './components/InfoPopover';
import EfetivoPanel from './components/EfetivoPanel';
import AprovadoresPanel from './components/AprovadoresPanel';
import UltimosRdosPanel from './components/UltimosRdosPanel';
import Treinamento from './views/Treinamento';
import { KPI_INFO } from './data/kpiInfo';

const PERIODOS = [30, 60, 90];

const gerarAlertas = (k) => {
  const out = [];
  if (k.conformidade < 70)
    out.push({ tipo: 'danger', msg: `Conformidade geral em ${k.conformidade}% — abaixo do limite aceitável (70%)` });
  if (k.taxaEmissao < 85)
    out.push({ tipo: 'danger', msg: `Taxa de emissão em ${k.taxaEmissao}% — meta 95%` });
  if (k.pendentes > 3)
    out.push({ tipo: 'danger', msg: `${k.pendentes} RDOs com aprovação pendente — risco de glose de medição` });
  if (k.aprovador3 < 80 && k.totalRdos > 0)
    out.push({ tipo: 'warn', msg: `Aprovação do cliente em ${k.aprovador3}% — meta 80%` });
  if (k.aprovador2 < 90 && k.totalRdos > 0)
    out.push({ tipo: 'warn', msg: `Aprovação do gerente em ${k.aprovador2}% — meta 90%` });
  if (k.mediaFotos < 30 && k.totalRdos > 0)
    out.push({ tipo: 'warn', msg: `Média de fotos por RDO: ${k.mediaFotos} — mínimo esperado: 30` });
  if (!out.length && k.totalRdos > 0)
    out.push({ tipo: 'info', msg: 'Todos os indicadores dentro das metas neste período.' });
  return out;
};

function ObraDashboard({ kpi, dias }) {
  const alertas = useMemo(() => gerarAlertas(kpi), [kpi]);

  return (
    <>
      <div className="kpi-grid">
        <KpiCard label="Taxa de Emissão"  valor={kpi.taxaEmissao} info={KPI_INFO.taxaEmissao} />
        <KpiCard label="Aprov. Supervisor" valor={kpi.aprovador1}  info={KPI_INFO.aprovador1} />
        <KpiCard label="Aprov. Gerente"    valor={kpi.aprovador2}  info={KPI_INFO.aprovador2} />
        <KpiCard label="Aprov. Cliente"    valor={kpi.aprovador3}  info={KPI_INFO.aprovador3} />
        <KpiCard label="RDOs Pendentes"    valor={kpi.pendentes}   info={KPI_INFO.pendentes} />
        <KpiCard label="Média de Fotos"    valor={kpi.mediaFotos}  info={KPI_INFO.mediaFotos} />
        <KpiCard label="RDOs Emitidos"     valor={kpi.totalRdos}   info={KPI_INFO.totalRdos}
                 metaLabel={`de ${kpi.esperados} dias úteis`} />
      </div>

      <div className="dash-row">
        <div className="panel">
          <div className="panel-head">
            <h2>Conformidade Geral</h2>
            <span className="panel-info-wrap"><InfoPopover info={KPI_INFO.conformidade} /></span>
          </div>
          <Gauge valor={kpi.conformidade} />
        </div>

        <div className="panel">
          <h2>Evolução Semanal</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={kpi.evolucaoSemanal || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sem" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="taxa"  stroke="#cf2927" strokeWidth={2} name="Taxa emissão %" />
              <Line type="monotone" dataKey="fotos" stroke="#3a3a3a" strokeWidth={2} name="Fotos médias" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dash-row dash-row-2col">
        <div className="panel">
          <h2>Alertas</h2>
          <div className="alerts">
            {alertas.map((a, i) => <AlertCard key={i} {...a} />)}
          </div>
        </div>

        <div className="panel">
          <h2>Ocorrências por tipo</h2>
          {kpi.ocorrencias?.length ? (
            <ResponsiveContainer width="100%" height={Math.max(200, kpi.ocorrencias.length * 32)}>
              <BarChart data={kpi.ocorrencias} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="tipo" width={140} />
                <Tooltip />
                <Bar dataKey="qtd" fill="#cf2927" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#6b6b6b', fontSize: 13 }}>
              Nenhuma ocorrência registrada no período.
            </p>
          )}
        </div>
      </div>

      <EfetivoPanel efetivo={kpi.efetivo} dias={dias} />

      <AprovadoresPanel ranking={kpi.aprovadoresRanking} />

      <UltimosRdosPanel
        rdos={kpi.ultimosRdos}
        mostrarObra={!!kpi.obra?.__consolidado}
      />

      <SobreKPIs />
    </>
  );
}

function SobreKPIs() {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="panel sobre-kpis">
      <button
        type="button"
        className="sobre-toggle"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
      >
        <span>📊 Sobre os KPIs — definições, fórmulas e tolerâncias</span>
        <span className="chevron">{aberto ? '▲' : '▼'}</span>
      </button>

      {aberto && (
        <div className="sobre-grid">
          {Object.entries(KPI_INFO).map(([key, info]) => (
            <div key={key} className="sobre-item">
              <h4>{info.titulo}</h4>
              <p>{info.descricao}</p>
              {info.formula && (
                <p><strong>Cálculo:</strong> <code>{info.formula}</code></p>
              )}
              {info.meta != null && (
                <p>
                  <strong>Meta:</strong> {info.invertido ? '≤ ' : '≥ '}
                  {info.meta}{info.unidade}
                </p>
              )}
              {info.bandas && (
                <ul className="sobre-bandas">
                  {info.bandas.map((b, i) => (
                    <li key={i} className={`band-${b.status}`}>
                      <span className="band-dot" /> {b.label}
                    </li>
                  ))}
                </ul>
              )}
              {info.impacto && (
                <p className="sobre-impacto">{info.impacto}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [dias, setDias]           = useState(30);
  const [obraSel, setObraSel]     = useState(null);
  const [view, setView]           = useState('dashboard'); // 'dashboard' | 'treinamento'
  const [menuOpen, setMenuOpen]   = useState(false);
  const { obras, kpis, loading, error, lastSync, recarregar } = useDiarioKPIs(dias);

  const obraAtual = obraSel || obras[0]?._id;
  const kpiAtual  = obraAtual ? kpis[obraAtual] : null;

  // Fecha o menu mobile quando trocar de view/obra
  useEffect(() => { setMenuOpen(false); }, [view, obraSel]);

  const selecionarObra = (id) => {
    setView('dashboard');
    setObraSel(id);
  };

  return (
    <div className={`app ${menuOpen ? 'menu-open' : ''}`}>
      {menuOpen && (
        <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      <aside className="sidebar">
        <div className="sidebar-header">
          <Logo variant="dark" height={36} />
          <button
            type="button"
            className="sidebar-close"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          >×</button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Obras</div>
          {obras.map((o) => (
            <button
              key={o._id}
              className={`${view === 'dashboard' && obraAtual === o._id ? 'active' : ''} ${o.__consolidado ? 'obra-consolidado' : ''}`}
              onClick={() => selecionarObra(o._id)}
            >
              <span className="obra-nome">
                {o.__consolidado ? `📊 ${o.nome}` : o.nome}
              </span>
              <span className="obra-meta">
                {kpis[o._id]
                  ? (o.__consolidado
                      ? `${o.totalObras} obras · Conformidade ${kpis[o._id].conformidade}%`
                      : `Conformidade ${kpis[o._id].conformidade}%`)
                  : 'Carregando…'}
              </span>
            </button>
          ))}
          {!obras.length && !loading && (
            <p style={{ padding: '0 20px', color: '#b0b0b0', fontSize: 12 }}>
              Nenhuma obra ativa encontrada.
            </p>
          )}

          <div className="sidebar-divider" />
          <div className="sidebar-section-label">Recursos</div>
          <button
            className={`nav-item-flat ${view === 'treinamento' ? 'active' : ''}`}
            onClick={() => setView('treinamento')}
          >
            📘 Treinamento e Usabilidade
          </button>
        </nav>

        <div className="sidebar-foot">
          {lastSync && (
            <>Última atualização<br />{lastSync.toLocaleString('pt-BR')}</>
          )}
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <button
            type="button"
            className="menu-btn"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
          >☰</button>

          {view === 'dashboard' && kpiAtual?.obra?.fotoUrl && !kpiAtual.obra.__consolidado && (
            <img
              src={kpiAtual.obra.fotoUrl}
              alt=""
              className="topbar-obra-foto"
            />
          )}

          <div className="topbar-title">
            <h1>
              {view === 'treinamento'
                ? 'Treinamento e Usabilidade'
                : (kpiAtual?.obra?.nome || 'Dashboard KPI RDO')}
            </h1>
            <div className="subtitle">
              {view === 'treinamento'
                ? 'Manual do dashboard KPI RDO'
                : `Sistenge Construções e Comércio Ltda. · Últimos ${dias} dias`}
            </div>
          </div>

          {view === 'dashboard' && (
            <div className="topbar-actions">
              {PERIODOS.map((d) => (
                <button
                  key={d}
                  className={`btn ${d === dias ? '' : 'btn-secondary'}`}
                  onClick={() => setDias(d)}
                >
                  {d}d
                </button>
              ))}
              <button className="btn btn-secondary btn-refresh" onClick={recarregar} disabled={loading}>
                {loading ? '…' : '↻'}
              </button>
            </div>
          )}
        </div>

        {view === 'treinamento' ? (
          <Treinamento />
        ) : (
          <>
            {error && (
              <div className="state-msg error">
                <h2>Erro ao carregar dados</h2>
                <pre>{error}</pre>
                <p>Verifique se o <code>vercel dev</code> está rodando e o <code>.env.local</code> está correto.</p>
              </div>
            )}

            {loading && !kpiAtual && (
              <div className="state-msg">
                <h2>Carregando dados da API…</h2>
                <p>Buscando obras e detalhes dos RDOs dos últimos {dias} dias.</p>
              </div>
            )}

            {kpiAtual && <ObraDashboard kpi={kpiAtual} dias={dias} />}
          </>
        )}
      </main>
    </div>
  );
}
