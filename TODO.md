# TODO — sistenge-kpi-rdo
# Lista de tarefas para o Claude Code executar em ordem

## Fase 1 — Setup inicial (fazer uma vez)
- [ ] Rodar `npm install` para garantir dependências
- [ ] Instalar Vercel CLI: `npm install -g vercel`
- [ ] Criar `.env.local` com a DIARIO_API_KEY (Evandro fornece a chave)
- [ ] Verificar que `.env.local` está no `.gitignore`
- [ ] Rodar `vercel dev` e confirmar que sobe na porta 3000

## Fase 2 — Validar a API (crítico antes de qualquer desenvolvimento)
- [ ] Testar endpoint de obras:
      `curl http://localhost:3000/api/diario/obras`
- [ ] Inspecionar a resposta JSON e anotar:
      - Nome do campo ID da obra (`_id` ou `id`)
      - Nome do campo do nome da obra
      - Se há campo `status` para filtrar ativas
- [ ] Testar endpoint de relatórios com ID real:
      `curl "http://localhost:3000/api/diario/obras/{ID_REAL}/relatorios?limit=5"`
- [ ] Inspecionar a resposta JSON e anotar:
      - Nome do campo de data do RDO (`data`, `dataRelatorio`, etc.)
      - Estrutura do array `aprovacoes` / `assinaturas`
      - Nome do campo de data de aprovação
      - Nome do campo de status da aprovação (valores possíveis)
      - Nome do campo de total de fotos
      - Nome do campo de criação do RDO
- [ ] Atualizar os extratores defensivos em `src/services/api.js`
      se os nomes dos campos diferirem do esperado
- [ ] Calcular manualmente 1 KPI (ex: taxa de emissão) e comparar
      com o que aparece no painel do diariodeobra.app para confirmar

## Fase 3 — Montar o App.jsx (dashboard principal)
- [ ] Criar `src/components/Logo.jsx` com o SVG Sistenge
- [ ] Criar `src/components/KpiCard.jsx`
- [ ] Criar `src/components/AlertCard.jsx`
- [ ] Criar `src/components/Gauge.jsx`
- [ ] Criar `src/App.jsx` integrando `useDiarioKPIs` com os componentes
      (usar `src/data/mock.js` como fallback enquanto API não está confirmada)
- [ ] Criar `src/index.css` com import das fontes Barlow/Barlow Condensed
- [ ] Testar no browser: `npm run dev` (mock) ou `vercel dev` (API real)

## Fase 4 — Conectar API real
- [ ] Substituir `VITE_USE_MOCK=true` por `VITE_USE_MOCK=false` no `.env.local`
- [ ] Confirmar que dados reais aparecem corretamente no dashboard
- [ ] Validar cada KPI contra o painel do diariodeobra.app
- [ ] Testar com obras reais da Sistenge (CR605, CR610, etc.)
- [ ] Verificar loading state e error state

## Fase 5 — Deploy
- [ ] Fazer login na Vercel: `vercel login`
- [ ] Deploy de preview: `vercel`
- [ ] Configurar variável de ambiente na Vercel:
      Dashboard Vercel → projeto → Settings → Environment Variables
      Adicionar: `DIARIO_API_KEY` = (valor da chave)
- [ ] Fazer deploy de produção: `vercel --prod`
- [ ] Testar a URL de produção

## Fase 6 — Refinamentos (após validação)
- [ ] Adicionar seletor de período (30 / 60 / 90 dias)
- [ ] Adicionar botão "Atualizar dados" com timestamp do último sync
- [ ] Adicionar drill-down: clicar no RDO pendente abre detalhes
- [ ] Adicionar export CSV dos KPIs do mês
- [ ] Avaliar autenticação Microsoft 365 SSO (usuários Sistenge)

## Notas importantes para o Claude Code

### Campos da API — mapeamento defensivo
A API pode retornar campos com nomes diferentes. O `api.js` já tem
extratores defensivos. Se a API retornar algo diferente, atualizar:

```js
// Em src/services/api.js — ajustar conforme resposta real da API:
const dataRdo    = (r) => r.data || r.dataRelatorio || r.createdAt;
const idProjeto  = (o) => o._id  || o.id;
const qtdFotos   = (r) => r.fotos?.total ?? r.qtdFotos ?? 0;
const aprovacoes = (r) => r.aprovacoes || r.assinaturas || [];
```

### Como confirmar que o proxy está funcionando
Se `curl http://localhost:3000/api/diario/obras` retornar JSON com
lista de obras, o proxy está funcionando. Se retornar HTML (a página
do Vite), o servidor Vercel não está rodando — usar `vercel dev`
em vez de `npm run dev`.

### Paleta Sistenge
```
--red:     #cf2927   (vermelho — cor principal)
--sidebar: #3a3a3a   (sidebar escura)
--cover:   #2b2b2b   (capa/header)
--bg:      #f4f4f8   (fundo claro)
--green:   #16a34a   (status saudável ≥ 85%)
--amber:   #d97706   (status atenção 70–84%)
```

### Logo Sistenge
NUNCA usar texto simples. Usar o SVG com paths vetoriais:
```jsx
// src/components/Logo.jsx — ver arquivo completo em CODIGO_ARQUIVOS.md
// Versão escuro: letras fill="#ffffff"
// Versão claro:  letras fill="#1c1c1c"
// Símbolo:       fill="#cf2927" (sempre)
```
