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
| API de dados | api.diariodeobra.app/v2 (header `Token`) |
| Autenticação | JWT no header `Token` + `App-Iss: app-web` |

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
# .env.local (desenvolvimento local) e Vercel (produção)
DIARIO_API_KEY=<JWT capturado do header Token no DevTools>
DIARIO_EMPRESA_ID=654a833d61927fcb36089a85   # Sistenge
# DIARIO_API_BASE=https://api.diariodeobra.app/v2   # opcional
```

**NUNCA** colocar a API Key no código React (front-end).
**NUNCA** usar variável prefixada com `VITE_` para a API Key.

## API — endpoints relevantes

Base URL: `https://api.diariodeobra.app/v2/empresas/{DIARIO_EMPRESA_ID}`

Headers obrigatórios:
- `Token: <JWT>` (NÃO é `Authorization: Bearer`)
- `App-Iss: app-web`
- `Accept: application/json`

| Endpoint (após o prefixo /empresas/{id}) | Método | Para quê |
|---|---|---|
| `/obras?grupoObra=true` | GET | Lista obras + envelope (`totalObras`, `statusObra`, `obras[]`, `gruposDeObra[]`) |
| `/obras/{id}` | GET | Detalhes de uma obra |
| `/obras/{id}/relatorios?limite=200&ordem=desc` | GET | RDOs (principal para KPIs) |
| `/obras/{id}/relatorios-aguardando-aprovacao` | GET | RDOs pendentes de aprovação |
| `/obras/{id}/relatorios/{id}` | GET | Detalhes de um RDO |
| `/obras/{id}/tarefas` | GET | Avanço físico (etapas/atividades) |

**Atenção:** parâmetros em português — `limite` (não `limit`), `ordem` (não `order`).

O endpoint `/obras` retorna um envelope; o array real vem em `data.obras`.
Filtre por `obra.status.id === 3` para obras "Em Andamento".

### Identificadores reais Sistenge

| ID | Nome |
|---|---|
| `654a8b4a43bf3a2a4d043e82` | 605 \| Fator Towers \| Unimed Maceió/AL |
| `681a18679767d8c7960db783` | 659 \| MPD \| Unimed Contagem/MG |
| `6a047c1c1dbf7931680f2826` | 691 \| Racional \| Garoa |

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

## Campos da API — mapeamento confirmado

Validado por inspeção no DevTools em 2026-05-22 contra a Sistenge:

```js
// Obra (do array data.obras)
obra._id                          // ID único (24 chars hex)
obra.nome                         // "605 | Fator Towers | Unimed Maceió/AL"
obra.status.id                    // 1=Não Iniciada, 2=Paralisada, 3=Em Andamento, 4=Concluída
obra.totalRelatorios              // total histórico de RDOs
obra.totalFotos                   // total histórico de fotos
obra.fotoUrl                      // capa
obra.grupo._id                    // ID do grupo de obras

// RDO (estrutura presumida — confirmar com curl em /obras/{id}/relatorios)
r.data || r.dataRelatorio         // data do RDO
r.fotos?.total || r.totalFotos    // fotos do dia
r.aprovacoes || r.assinaturas     // array de aprovações
ap.status === 'aprovado'          // aprovado
ap.status === 'pendente'          // aguardando
r.criadoEm || r.data              // data de criação
```

Se algum campo divergir, atualizar `src/services/api.js` (extratores no topo).

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
