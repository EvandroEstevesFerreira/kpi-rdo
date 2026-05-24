import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

const PALETA = ['#cf2927', '#3a3a3a', '#d97706', '#16a34a', '#2563eb', '#7c3aed'];

export default function HistogramaPanel({ porMes, categoriaNomes }) {
  if (!porMes?.length || !categoriaNomes?.length) {
    return (
      <div className="panel">
        <h2>Histograma de Mão de Obra</h2>
        <p style={{ color: '#6b6b6b', fontSize: 13 }}>
          Sem efetivo registrado para gerar o histograma.
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Histograma de Mão de Obra</h2>
        <span className="panel-sub">
          Últimos 12 meses · média diária empilhada por categoria
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={porMes} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {categoriaNomes.map((cat, i) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="ef"
              fill={PALETA[i % PALETA.length]}
              name={cat}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
