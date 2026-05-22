export const OBRAS_MOCK = [
  { _id: 'CR605', nome: '605 | Fator Towers | Unimed Maceió/AL',      gerente: 'Gerente Contrato A' },
  { _id: 'CR610', nome: '610 | Hospital Regional | Fortaleza/CE',     gerente: 'Gerente Contrato B' },
  { _id: 'CR618', nome: '618 | Torre Comercial | São Paulo/SP',       gerente: 'Gerente Contrato C' },
];

export const KPIS_MOCK = {
  CR605: {
    taxaEmissao: 88,  aprovador1: 92, aprovador2: 78, aprovador3: 55,
    pendentes: 4,     mediaFotos: 49, conformidade: 78,
    totalRdos: 20,    esperados: 22,
    evolucaoSemanal: [
      { sem: 'S1', taxa: 100, emitidos: 5, esperados: 5, fotos: 51 },
      { sem: 'S2', taxa: 100, emitidos: 5, esperados: 5, fotos: 48 },
      { sem: 'S3', taxa: 80,  emitidos: 4, esperados: 5, fotos: 43 },
      { sem: 'S4', taxa: 100, emitidos: 5, esperados: 5, fotos: 56 },
      { sem: 'S5', taxa: 60,  emitidos: 3, esperados: 5, fotos: 38 },
    ],
    ocorrencias: [
      { tipo: 'Paralisação Climática — Total',  qtd: 8 },
      { tipo: 'Solicitação do Contratante',     qtd: 7 },
      { tipo: 'Falta de Material — Fornecedor', qtd: 5 },
      { tipo: 'Projeto Pendente / Sem Aprovação', qtd: 4 },
      { tipo: 'Equipamento Parado — Manutenção', qtd: 3 },
      { tipo: 'Acidente / Quase-Acidente',      qtd: 2 },
    ],
    tempoMedio: { ap1: 0.9, ap2: 2.1, ap3: 5.8 },
    alertas: [
      { tipo: 'danger', msg: '4 RDOs aguardando aprovação do cliente há mais de 7 dias' },
      { tipo: 'warn',   msg: 'Aprovador 2 com tempo médio acima de 2 dias na última semana' },
      { tipo: 'info',   msg: 'Taxa de emissão caiu para 60% na semana S5 — verificar motivo' },
    ],
  },
  CR610: {
    taxaEmissao: 93,  aprovador1: 97, aprovador2: 91, aprovador3: 72,
    pendentes: 2,     mediaFotos: 60, conformidade: 88,
    totalRdos: 27,    esperados: 29,
    evolucaoSemanal: [
      { sem: 'S1', taxa: 100, emitidos: 6, esperados: 6, fotos: 62 },
      { sem: 'S2', taxa: 83,  emitidos: 5, esperados: 6, fotos: 58 },
      { sem: 'S3', taxa: 100, emitidos: 6, esperados: 6, fotos: 65 },
      { sem: 'S4', taxa: 100, emitidos: 6, esperados: 6, fotos: 60 },
      { sem: 'S5', taxa: 83,  emitidos: 5, esperados: 6, fotos: 55 },
    ],
    ocorrencias: [
      { tipo: 'Projeto Pendente / Sem Aprovação', qtd: 6 },
      { tipo: 'Solicitação do Contratante',       qtd: 5 },
      { tipo: 'Falta de Material — Fornecedor',   qtd: 3 },
      { tipo: 'Paralisação Climática — Total',    qtd: 4 },
      { tipo: 'Equipamento Parado — Manutenção',  qtd: 2 },
      { tipo: 'Acidente / Quase-Acidente',        qtd: 1 },
    ],
    tempoMedio: { ap1: 0.7, ap2: 1.5, ap3: 4.3 },
    alertas: [
      { tipo: 'warn', msg: 'Aprovação do cliente abaixo da meta: 72% vs meta 80%' },
      { tipo: 'info', msg: 'Pico de ocorrências de Projeto Pendente — 6 registros no mês' },
    ],
  },
  CR618: {
    taxaEmissao: 72,  aprovador1: 71, aprovador2: 58, aprovador3: 38,
    pendentes: 11,    mediaFotos: 25, conformidade: 60,
    totalRdos: 18,    esperados: 25,
    evolucaoSemanal: [
      { sem: 'S1', taxa: 80,  emitidos: 4, esperados: 5, fotos: 28 },
      { sem: 'S2', taxa: 60,  emitidos: 3, esperados: 5, fotos: 22 },
      { sem: 'S3', taxa: 100, emitidos: 5, esperados: 5, fotos: 35 },
      { sem: 'S4', taxa: 80,  emitidos: 4, esperados: 5, fotos: 24 },
      { sem: 'S5', taxa: 40,  emitidos: 2, esperados: 5, fotos: 18 },
    ],
    ocorrencias: [
      { tipo: 'Projeto Pendente / Sem Aprovação',  qtd: 9 },
      { tipo: 'Falta de Material — Fornecedor',    qtd: 8 },
      { tipo: 'Equipamento Parado — Manutenção',   qtd: 5 },
      { tipo: 'Solicitação do Contratante',         qtd: 4 },
      { tipo: 'Acidente / Quase-Acidente',          qtd: 4 },
      { tipo: 'Paralisação Climática — Total',      qtd: 3 },
    ],
    tempoMedio: { ap1: 2.4, ap2: 4.1, ap3: 11.2 },
    alertas: [
      { tipo: 'danger', msg: 'CRÍTICO: Taxa de emissão em 40% na última semana' },
      { tipo: 'danger', msg: '11 RDOs pendentes de aprovação — risco de glose de medição' },
      { tipo: 'danger', msg: 'Conformidade geral em 60% — abaixo do limite aceitável (70%)' },
      { tipo: 'warn',   msg: 'Aprovador 2 com 4,1 dias de prazo médio — meta: 2 dias' },
      { tipo: 'warn',   msg: 'Média de fotos por RDO: 25 — mínimo esperado: 30' },
    ],
  },
};
