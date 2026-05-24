import { useState, useEffect, useCallback } from 'react';
import {
  getObras,
  getRelatoriosNaJanela,
  calcularKPIs,
  calcularEfetivo,
  limparCache,
} from '../services/api';

const hoje      = () => new Date().toISOString().slice(0, 10);
const diasAtras = (n) =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

export const CONSOLIDADO_ID = '__consolidado__';

/**
 * Hook principal — busca obras e calcula KPIs de todas em paralelo.
 * Cada obra dispara N chamadas ao endpoint de detalhe (uma por RDO
 * dentro da janela), com concorrência limitada internamente.
 *
 * @param {number} dias - Janela de análise em dias corridos (default: 30)
 */
export function useDiarioKPIs(dias = 30) {
  const [obras,    setObras]    = useState([]);
  const [kpis,     setKpis]     = useState({});
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const listaObras = await getObras();
      setObras(listaObras);

      const inicio    = diasAtras(dias);
      const fim       = hoje();
      const inicioAno = diasAtras(365);

      const pares = await Promise.all(
        listaObras.map(async (obra) => {
          const id = obra._id;
          // Busca RDOs do periodo (para KPIs) e dos ultimos 12 meses
          // (para o histograma) em paralelo. O cache compartilhado evita
          // duplicar requests sobrepostos.
          const [rdos, rdosAno] = await Promise.all([
            getRelatoriosNaJanela(id, inicio, fim),
            getRelatoriosNaJanela(id, inicioAno, fim),
          ]);
          return { id, obra, rdos, rdosAno };
        })
      );

      const kpisMap = {};
      const todosRdos = [];
      const todosRdosAno = [];
      for (const { id, obra, rdos, rdosAno } of pares) {
        const rdosTagged = rdos.map((r) => ({
          ...r,
          __obraId: obra._id,
          __obraNome: obra.nome,
        }));
        const historico = calcularEfetivo(rdosAno, {
          preencherMeses: { inicio: inicioAno, fim },
        });
        kpisMap[id] = {
          ...calcularKPIs(rdosTagged, inicio, fim),
          obra,
          historicoMensal: {
            porMes: historico.porMes,
            categoriaNomes: historico.categoriaNomes,
          },
        };
        for (const r of rdosTagged) todosRdos.push(r);
        for (const r of rdosAno) todosRdosAno.push(r);
      }

      const consolidadoObra = {
        _id: CONSOLIDADO_ID,
        nome: 'Consolidado — Todas as obras',
        __consolidado: true,
        totalObras: listaObras.length,
      };
      const histConsolidado = calcularEfetivo(todosRdosAno, {
        preencherMeses: { inicio: inicioAno, fim },
      });
      kpisMap[CONSOLIDADO_ID] = {
        ...calcularKPIs(todosRdos, inicio, fim, { numObras: listaObras.length }),
        obra: consolidadoObra,
        historicoMensal: {
          porMes: histConsolidado.porMes,
          categoriaNomes: histConsolidado.categoriaNomes,
        },
      };

      setObras([consolidadoObra, ...listaObras]);
      setKpis(kpisMap);
      setLastSync(new Date());
    } catch (err) {
      console.error('[useDiarioKPIs]', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dias]);

  useEffect(() => { carregar(); }, [carregar]);

  // Auto-refresh a cada 10 minutos
  useEffect(() => {
    const t = setInterval(() => {
      limparCache();
      carregar();
    }, 10 * 60 * 1000);
    return () => clearInterval(t);
  }, [carregar]);

  return {
    obras,
    kpis,
    loading,
    error,
    lastSync,
    recarregar: () => { limparCache(); carregar(); },
  };
}
