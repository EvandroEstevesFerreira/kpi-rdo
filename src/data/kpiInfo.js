// Documentação técnica de cada KPI: descrição, fórmula, metas e bandas
// de tolerância. Usado nos tooltips/popovers do dashboard e como fonte
// de verdade para gerar os alertas.

export const KPI_INFO = {
  taxaEmissao: {
    titulo: 'Taxa de Emissão',
    descricao:
      'Percentual de dias úteis no período em que houve emissão de RDO. ' +
      'Indica a regularidade do registro diário da obra.',
    formula: 'RDOs emitidos ÷ dias úteis × 100',
    meta: 95,
    unidade: '%',
    invertido: false,
    bandas: [
      { ate: 100, status: 'ok',   label: 'Saudável ≥ 95%' },
      { ate: 94,  status: 'warn', label: 'Atenção 85–94%' },
      { ate: 84,  status: 'crit', label: 'Crítico < 85%' },
    ],
    impacto:
      'Taxa baixa indica risco de glose de medição contratual e perda de ' +
      'rastreabilidade do que aconteceu em obra.',
  },

  aprovador1: {
    titulo: 'Aprovação Supervisor (D+1)',
    descricao:
      '% de RDOs aprovados pelo supervisor da obra dentro de 1 dia útil ' +
      'após a criação. Primeiro aprovador no fluxo.',
    formula: 'RDOs aprovados em D+1 ÷ total RDOs × 100',
    meta: 95,
    unidade: '%',
    invertido: false,
    bandas: [
      { ate: 100, status: 'ok',   label: 'Saudável ≥ 95%' },
      { ate: 94,  status: 'warn', label: 'Atenção 80–94%' },
      { ate: 79,  status: 'crit', label: 'Crítico < 80%' },
    ],
    impacto:
      'Atraso aqui represa todo o fluxo seguinte. Tipicamente reflete ' +
      'sobrecarga ou ausência do supervisor em campo.',
  },

  aprovador2: {
    titulo: 'Aprovação Gerente (D+2)',
    descricao:
      '% de RDOs aprovados pelo gerente do contrato dentro de 2 dias úteis ' +
      'após criação. Segundo aprovador.',
    formula: 'RDOs aprovados em D+2 ÷ total RDOs × 100',
    meta: 90,
    unidade: '%',
    invertido: false,
    bandas: [
      { ate: 100, status: 'ok',   label: 'Saudável ≥ 90%' },
      { ate: 89,  status: 'warn', label: 'Atenção 75–89%' },
      { ate: 74,  status: 'crit', label: 'Crítico < 75%' },
    ],
    impacto:
      'Gargalo no gerente afeta o envio para o cliente e o ciclo de medição. ' +
      'Pode indicar falta de delegação ou excesso de obras por gerente.',
  },

  aprovador3: {
    titulo: 'Aprovação Cliente (D+7)',
    descricao:
      '% de RDOs aprovados pelo cliente/fiscalização dentro de 7 dias após ' +
      'criação. Terceiro e último aprovador.',
    formula: 'RDOs aprovados em D+7 ÷ total RDOs × 100',
    meta: 80,
    unidade: '%',
    invertido: false,
    bandas: [
      { ate: 100, status: 'ok',   label: 'Saudável ≥ 80%' },
      { ate: 79,  status: 'warn', label: 'Atenção 60–79%' },
      { ate: 59,  status: 'crit', label: 'Crítico < 60%' },
    ],
    impacto:
      'RDO sem aprovação do cliente em D+7 pode ser contestado em medição. ' +
      'Acompanhar relacionamento institucional com a fiscalização.',
  },

  pendentes: {
    titulo: 'RDOs Pendentes',
    descricao:
      'Quantidade absoluta de RDOs do período que ainda têm pelo menos ' +
      'uma assinatura/aprovação faltando.',
    formula: 'Contagem de RDOs com aprovado=false em qualquer aprovador',
    meta: 3,
    unidade: '',
    invertido: true,
    bandas: [
      { ate: 3,   status: 'ok',   label: 'Saudável ≤ 3' },
      { ate: 6,   status: 'warn', label: 'Atenção 4–6' },
      { ate: 999, status: 'crit', label: 'Crítico > 6' },
    ],
    impacto:
      'Volume crescente de pendentes indica que o gargalo está se acumulando. ' +
      'Ação imediata: identificar o aprovador que está represando.',
  },

  mediaFotos: {
    titulo: 'Média de Fotos por RDO',
    descricao:
      'Quantidade média de fotos anexadas em cada RDO no período. ' +
      'Proxy para qualidade do registro fotográfico da obra.',
    formula: 'Soma de fotos ÷ total RDOs',
    meta: 30,
    unidade: '',
    invertido: false,
    bandas: [
      { ate: 999, status: 'ok',   label: 'Saudável ≥ 30' },
      { ate: 29,  status: 'warn', label: 'Atenção 20–29' },
      { ate: 19,  status: 'crit', label: 'Crítico < 20' },
    ],
    impacto:
      'RDOs com poucas fotos são frágeis em caso de auditoria ou disputa ' +
      'contratual. Mínimo absoluto: documentar cada frente de serviço.',
  },

  totalRdos: {
    titulo: 'RDOs Emitidos',
    descricao:
      'Quantidade absoluta de RDOs emitidos no período de análise. Comparado ' +
      'com o número de dias úteis esperados.',
    formula: 'Contagem de relatórios com data dentro da janela',
    meta: null,
    unidade: '',
    invertido: false,
    impacto:
      'Diferença entre emitidos e dias úteis aponta exatamente quantos dias ' +
      'estão sem registro — peça de evidência primária do KPI Taxa de Emissão.',
  },

  conformidade: {
    titulo: 'Conformidade Geral',
    descricao:
      'Índice ponderado que sintetiza os principais KPIs em um único valor. ' +
      'Métrica executiva para visão consolidada da obra.',
    formula:
      'Taxa Emissão × 0,40 + Aprov.1 × 0,20 + Aprov.2 × 0,20 + Aprov.3 × 0,20',
    meta: 85,
    unidade: '%',
    invertido: false,
    bandas: [
      { ate: 100, status: 'ok',   label: 'Saudável ≥ 85%' },
      { ate: 84,  status: 'warn', label: 'Atenção 70–84%' },
      { ate: 69,  status: 'crit', label: 'Crítico < 70%' },
    ],
    impacto:
      'É o número que vai para a Diretoria. Obra abaixo de 70% exige plano ' +
      'de ação formal; abaixo de 60% exige escalonamento.',
  },
};
