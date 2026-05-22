import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar,
} from 'recharts';
import { useDiarioKPIs } from './hooks/useDiarioKPIs';
import Logo from './components/Logo';
import KpiCard from './components/KpiCard';
import AlertCard from './components/AlertCard';
import Gauge from './components/Gauge';

const PERIODOS = [30, 60, 90];

// Gera alertas dinamicamente a partir dos KPIs calculados
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

function ObraDashboard({ kpi }) {
  const alertas = useMemo(() => gerarAlertas(kpi), [kpi]);

  return (
    <>
      <div className="kpi-grid">
        <KpiCard label="Taxa de Emissão"        valor={kpi.taxaEmissao} meta={95} />
        <KpiCard label="Aprovação Supervisor"   valor={kpi.aprovador1}  meta={95} />
        <KpiCard label="Aprovação Gerente"      valor={kpi.aprovador2}  meta={90} />
        <KpiCard label="Aprovação Cliente"      valor={kpi.aprovador3}  meta={80} />
        <KpiCard label="RDOs Pendentes"         valor={kpi.pendentes}   meta={3}  unidade=""    invertido metaLabel="≤ 3" />
        <KpiCard label="Média de Fotos"         valor={kpi.mediaFotos}  meta={30} unidade=""    metaLabel="≥ 30" />
        <KpiCard label="RDOs Emitidos"          valor={kpi.totalRdos}                            unidade=""    metaLabel={`de ${kpi.esperados} úteis`} meta={kpi.esperados} />
      </div>

      <div className="dash-row">
        <div className="panel">
          <h2>Conformidade Geral</h2>
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

      <div className="dash-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
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
    </>
  );
}

export default function App() {
  const [dias, setDias] = useState(30);
  const [obraSel, setObraSel] = useState(null);
  const { obras, kpis, loading, error, lastSync, recarregar } = useDiarioKPIs(dias);

  // Seleciona a primeira obra automaticamente quando carrega
  const obraAtual = obraSel || obras[0]?._id;
  const kpiAtual  = obraAtual ? kpis[obraAtual] : null;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Logo variant="dark" height={36} />
        </div>

        <nav className="sidebar-nav">
          {obras.map((o) => (
            <button
              key={o._id}
              className={obraAtual === o._id ? 'active' : ''}
              onClick={() => setObraSel(o._id)}
            >
              <span className="obra-nome">{o.nome}</span>
              <span className="obra-meta">
                {kpis[o._id]
                  ? `Conformidade ${kpis[o._id].conformidade}%`
                  : 'Carregando…'}
              </span>
            </button>
          ))}
          {!obras.length && !loading && (
            <p style={{ padding: '0 20px', color: '#b0b0b0', fontSize: 12 }}>
              Nenhuma obra ativa encontrada.
            </p>
          )}
        </nav>

        <div className="sidebar-foot">
          {lastSync && (
            <>Última atualização<br />{lastSync.toLocaleString('pt-BR')}</>
          )}
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <h1>{kpiAtual?.obra?.nome || 'Dashboard KPI RDO'}</h1>
            <div className="subtitle">
              Sistenge Construções e Comércio Ltda. · Últimos {dias} dias
            </div>
          </div>
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
            <button className="btn btn-secondary" onClick={recarregar} disabled={loading}>
              {loading ? 'Atualizando…' : '↻ Atualizar'}
            </button>
          </div>
        </div>

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

        {kpiAtual && <ObraDashboard kpi={kpiAtual} />}
      </main>
    </div>
  );
}
