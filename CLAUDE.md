# sistenge-kpi-rdo — Dashboard KPI de RDO

## O que é este projeto

Dashboard de monitoramento de KPIs do Relatório Diário de Obra (RDO) da
**Sistenge Construções e Comércio Ltda.** Consome a API REST do sistema
**diariodeobra.app** e calcula indicadores de conformidade em tempo real
para o Gerente de Contratos e a Diretoria de Engenharia.

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | React 19 + Vite |
| Gráficos | Recharts |
| Proxy serverless | Vercel Edge Functions |
| Deploy | Vercel (mesmo org do Manu CMMS) |
| API de dados | api.diariodeobra.app/v1 (Bearer JWT) |
| Autenticação | API Key via variável de ambiente DIARIO_API_KEY |

## Estrutura de pastas

```
sistenge-kpi-rdo/
├── api/
│   └── diario/
│       └── proxy.js          ← Vercel serverless — injeta API Key
├── src/
│   ├── services/
│   │   └── api.js            ← Chamadas à API + cálculo de KPIs
│   ├── hooks/
│   │   └── useDiarioKPIs.js  ← Hook React que alimenta o dashboard
│   ├── components/
│   │   ├── KpiCard.jsx       ← Card individual de KPI
│   │   ├── AlertCard.jsx     ← Banner de alerta
│   │   ├── Gauge.jsx         ← Medidor semicircular
│   │   └── Logo.jsx          ← Logo SVG Sistenge
│   ├── App.jsx               ← Dashboard principal (entrada)
│   └── main.jsx              ← Entry point React
├── public/
├── .env.local                ← API Key local (NUNCA no Git)
├── .env.example              ← Modelo de variáveis sem valores reais
├── .gitignore
├── vercel.json               ← Rewrite rules para o proxy
├── vite.config.js
├── package.json
└── CLAUDE.md                 ← Este arquivo
```

## Variáveis de ambiente necessárias

```
# .env.local (desenvolvimento local)
DIARIO_API_KEY=seu_jwt_aqui

# Vercel (produção) — configurar em:
# vercel.com → projeto → Settings → Environment Variables
DIARIO_API_KEY=seu_jwt_aqui
```

**NUNCA** colocar a API Key no código React (front-end).
**NUNCA** usar variável prefixada com `VITE_` para a API Key.

## API — endpoints relevantes

Base URL: `https://api.diariodeobra.app/v1`
Auth: `Authorization: Bearer ${DIARIO_API_KEY}`

| Endpoint | Método | Para quê |
|---|---|---|
| `/obras` | GET | Lista contratos ativos |
| `/obras/{id}` | GET | Detalhes de um contrato |
| `/obras/{id}/relatorios` | GET | RDOs (principal para KPIs) |
| `/obras/{id}/relatorios/{id}` | GET | Detalhes de um RDO |
| `/obras/{id}/tarefas` | GET | Avanço físico (etapas/atividades) |
| `/cadastros` | GET | Mão de obra, equipamentos, ocorrências |

Parâmetros do endpoint de relatórios: `limit` (default 50, usar 200),
`order` ("asc" | "desc").

## KPIs implementados

| KPI | Meta | Fórmula |
|---|---|---|
| Taxa de Emissão | ≥ 95% | RDOs emitidos ÷ dias úteis × 100 |
| Aprovação Ap. 1 (Supervisor) | ≥ 95% | % RDOs aprovados em D+1 |
| Aprovação Ap. 2 (Gerente) | ≥ 90% | % RDOs aprovados em D+2 |
| Aprovação Ap. 3 (Cliente) | ≥ 80% | % RDOs aprovados em D+7 |
| RDOs Pendentes | ≤ 3 | Contagem absoluta pendentes |
| Média de Fotos | ≥ 30 | Total fotos ÷ total RDOs |
| Ocorrências por tipo | ≥ 8/mês | Group by tipo de ocorrência |
| Conformidade Geral | ≥ 85% | Emissão×0.4 + Ap1×0.2 + Ap2×0.2 + Ap3×0.2 |

## Identidade visual Sistenge

- Cor primária: `#cf2927` (vermelho — usar em destaques, bordas de status)
- Fundo claro: `#f4f4f8`
- Sidebar: `#3a3a3a`
- Capa/header escuro: `#2b2b2b`
- Logo: SVG inline com paths vetoriais reais (ver `src/components/Logo.jsx`)
- Fonte display: `Barlow Condensed` (Google Fonts)
- Fonte corpo: `Barlow` (Google Fonts)

**Nunca** usar texto simples "SISTENGE" como logo — usar sempre o SVG
com os paths vetoriais reais que constam em `src/components/Logo.jsx`.

## Fluxo de aprovação dos RDOs

```
Responsável Operacional (cria RDO — D+0 até 17h30)
  → Supervisor da Obra     (Aprovador 1 — D+1 até 12h)
  → Gerente do Contrato    (Aprovador 2 — D+2 até 17h)
  → Cliente / Fiscalização (Aprovador 3 — até D+7)
```

## Status de conformidade

| Faixa | Status | Cor |
|---|---|---|
| ≥ 85% | Saudável | `#16a34a` (verde) |
| 70–84% | Atenção | `#d97706` (âmbar) |
| < 70% | Crítico | `#cf2927` (vermelho) |

## Dados mock (fallback)

O arquivo `src/data/mock.js` contém dados simulados para 3 contratos
(CR605, CR610, CR618). Usado quando:
- A API Key não está configurada
- A API retorna erro
- Variável `VITE_USE_MOCK=true` está definida

Permite apresentações e desenvolvimento de UI sem precisar da API real.

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variável de ambiente
cp .env.example .env.local
# Editar .env.local e colocar a API Key real

# 3. Rodar em modo desenvolvimento
npm run dev
# Acessa em http://localhost:5173

# 4. Rodar com Vercel CLI (necessário para o proxy funcionar)
vercel dev
# Acessa em http://localhost:3000
```

> **Atenção:** `npm run dev` (Vite puro) NÃO executa as Vercel Functions.
> Para testar o proxy localmente, usar `vercel dev`.

## Deploy

```bash
# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

Configurar a variável `DIARIO_API_KEY` no painel da Vercel antes do deploy:
`vercel.com → sistenge-kpi-rdo → Settings → Environment Variables`

## Campos da API — mapeamento defensivo

A API pode retornar nomes de campos ligeiramente diferentes dependendo da
versão. O `api.js` usa mapeamento defensivo:

```js
// Data do RDO
r.data || r.dataRelatorio

// ID do projeto
obra._id || obra.id

// Total de fotos
r.fotos?.total || r.qtdFotos || 0

// Aprovações
r.aprovacoes || r.assinaturas || []

// Status de aprovação
ap.status === 'aprovado'   // aprovado
ap.status === 'pendente'   // aguardando
ap.status === 'aguardando' // alternativo

// Data de criação
r.criadoEm || r.data
```

Se a API retornar campos com nomes diferentes, atualizar o mapeamento
em `src/services/api.js` na função `calcularKPIs`.

## Tarefas pendentes na primeira sessão

Ao abrir o projeto pela primeira vez no Claude Code, executar nesta ordem:

1. `npm install` — instalar dependências
2. `vercel dev` — subir servidor local com proxy
3. Testar endpoint `/api/diario/obras` no browser ou curl
4. Inspecionar a resposta JSON e confirmar os nomes dos campos
5. Ajustar mapeamento em `api.js` se necessário
6. Confirmar que os KPIs calculados batem com os dados visíveis no
   painel do diariodeobra.app para um contrato específico
7. Se tudo OK, fazer `vercel --prod` para deploy

## Contexto da empresa

- **Empresa:** Sistenge Construções e Comércio Ltda.
- **Localização:** São Paulo/SP
- **Porte:** ~300 funcionários CLT, 13+ centros de resultado
- **Diretor Técnico:** José Roberto Enz Lui
- **Diretor Administrativo:** André Piva
- **Gerente de RH / responsável pelo projeto:** Evandro Ferreira
- **Sistema de ponto:** Pontomais
- **Sistema de folha:** ADP
- **Outros projetos:** Manu CMMS (manu-cmms.vercel.app) — mesmo stack

## Referências adicionais

- `docs/guia-integracao-api.html` — Guia técnico completo da API
- `docs/manual-kpi-rdo.html` — Manual de KPIs e gestão
- `src/data/mock.js` — Estrutura esperada dos dados (serve como spec)
