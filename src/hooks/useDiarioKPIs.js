import { useState, useEffect, useCallback } from 'react';
import {
  getObras,
  getRelatorios,
  calcularKPIs,
  limparCache,
} from '../services/api';

const hoje     = () => new Date().toISOString().slice(0, 10);
const diasAtras = (n) =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

/**
 * Hook principal — busca obras e calcula KPIs de todas em paralelo.
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
          const id   = obra._id || obra.id;
          const rdos = await getRelatorios(id);
          return [id, { ...calcularKPIs(rdos, inicio, fim), obra }];
        })
      );

      setKpis(Object.fromEntries(pares));
      setLastSync(new Date());
    } catch (err) {
      console.error('[useDiarioKPIs]', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dias]);

  // Carrega na montagem
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
