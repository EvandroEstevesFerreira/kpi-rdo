import { useState, useEffect, useCallback } from 'react';
import {
  getObras,
  getRelatoriosNaJanela,
  calcularKPIs,
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

      const inicio = diasAtras(dias);
      const fim    = hoje();

      const pares = await Promise.all(
        listaObras.map(async (obra) => {
          const id   = obra._id;
          const rdos = await getRelatoriosNaJanela(id, inicio, fim);
          return { id, obra, rdos };
        })
      );

      const kpisMap = {};
      const todosRdos = [];
      for (const { id, obra, rdos } of pares) {
        kpisMap[id] = { ...calcularKPIs(rdos, inicio, fim), obra };
        todosRdos.push(...rdos);
      }

      const consolidadoObra = {
        _id: CONSOLIDADO_ID,
        nome: 'Consolidado — Todas as obras',
        __consolidado: true,
        totalObras: listaObras.length,
      };
      kpisMap[CONSOLIDADO_ID] = {
        ...calcularKPIs(todosRdos, inicio, fim, { numObras: listaObras.length }),
        obra: consolidadoObra,
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
