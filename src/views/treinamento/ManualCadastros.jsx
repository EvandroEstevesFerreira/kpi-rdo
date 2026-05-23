// Manual de Implementação dos Cadastros — Sistenge — v1.0 Mai/2026

export default function ManualCadastros() {
  return (
    <>
      <Secao id="visao-geral" titulo="01 — Visão Geral" sub="Entendendo os módulos de cadastro">
        <p>
          O sistema diariodeobras.net divide-se em dois grupos: <strong>Cadastros</strong>
          {' '}(configurações feitas uma vez, antes de começar a operar) e <strong>RDO
          diário</strong> (operação cotidiana). Este manual cobre os cadastros — a base
          que torna o RDO mais rápido, padronizado e rastreável.
        </p>

        <Nota tipo="info" titulo="Lógica fundamental do sistema">
          Os cadastros são feitos uma única vez por obra/empresa e ficam disponíveis
          como opções de seleção rápida no RDO diário. Quanto melhor o cadastro, mais
          rápido e preciso o preenchimento diário.
        </Nota>

        <div className="card-grid">
          <CardModulo
            emoji="👷"
            titulo="Mão de Obra"
            menu="Cadastros → Mão de obra"
            desc="Cadastra as funções/cargos que existem nas obras. No RDO, informa-se a quantidade de cada função — sem digitar o nome do cargo toda vez."
            duracao="3min 33s"
          />
          <CardModulo
            emoji="🚜"
            titulo="Equipamentos"
            menu="Cadastros → Equipamentos"
            desc="Cadastra os equipamentos e máquinas que operam nas obras. No RDO, marca-se quais estão disponíveis no dia."
            duracao="58s (web) + 58s (app)"
          />
          <CardModulo
            emoji="⚠️"
            titulo="Tipos de Ocorrências"
            menu="Cadastros → Tipos de ocorrências"
            desc="Cria categorias padronizadas de ocorrência. Facilita filtros, relatórios e análises históricas."
            duracao="1min (web) + 1min (app)"
          />
          <CardModulo
            emoji="📋"
            titulo="Lista de Tarefas"
            menu="Lista de tarefas"
            desc="Estrutura a obra em Etapas (grandes fases) e Atividades (serviços). No RDO, as atividades ficam disponíveis para seleção rápida."
            duracao="57s + 42s + 57s"
          />
        </div>

        <Nota tipo="warn" titulo="Impacto direto no RDO">
          Sem os cadastros configurados, o preenchimento diário do RDO é mais lento,
          menos padronizado e dificulta a geração de relatórios analíticos. Faça os
          cadastros <strong>antes de criar o primeiro RDO</strong> de qualquer obra.
        </Nota>
      </Secao>

      <Secao id="mao-de-obra" titulo="02 — Mão de Obra" sub="Cadastro de funções/cargos">
        <p>
          O módulo cadastra as funções/cargos que existem nas obras. Cria um banco que
          aparece como seleção rápida no RDO diário, padronizando a nomenclatura entre
          todos os contratos.
        </p>

        <h4 className="sub-h">Como cadastrar no sistema</h4>
        <ol className="passos">
          <li><strong>Acesse o menu Cadastros</strong> → na barra lateral (web) ou menu hambúrguer (app), abra <code>Cadastros → Mão de obra</code>.</li>
          <li><strong>Visualize a lista de efetivos cadastrados</strong> — na primeira vez estará vazia. Clique no botão "+" ou "Adicionar".</li>
          <li><strong>Preencha os campos</strong> — informe o nome do cargo e, se disponível, a categoria (Direta / Indireta / Terceiros).</li>
          <li><strong>Uso no RDO diário</strong> — o campo "Mão de obra" lista todas as funções; basta informar a quantidade presente no dia.</li>
        </ol>

        <h4 className="sub-h">Sugestão de cadastro — Sistenge</h4>
        <p className="secao-sub">
          Baseado nos efetivos registrados na CR 605 (Fator Towers) e no padrão de obras
          de instalações elétricas e hidráulicas.
        </p>

        <TabelaScroll>
          <thead>
            <tr><th>#</th><th>Função / Cargo</th><th>Categoria</th><th>Disciplina</th><th>Presença típica</th></tr>
          </thead>
          <tbody>
            <Tr n="01" func="Supervisor de Obras"             cat="MOI"       disc="Gestão de campo"      pres="1 por obra" />
            <Tr n="02" func="Encarregado Técnico"             cat="MOI"       disc="Coordenação técnica"  pres="1–2 por obra" />
            <Tr n="03" func="Encarregado de Obras"            cat="MOD"       disc="Produção geral"       pres="1–2 por frente" />
            <Tr n="04" func="Encarregado Administrativo"      cat="MOI"       disc="Administração local"  pres="1 por obra" />
            <Tr n="05" func="Auxiliar de Engenharia"          cat="MOI"       disc="Suporte técnico"      pres="1 por obra" />
            <Tr n="06" func="Assistente Administrativo"       cat="MOI"       disc="Apoio administrativo" pres="1 por obra" />
            <Tr n="07" func="Almoxarife"                      cat="MOI"       disc="Materiais"            pres="1 por obra" />
            <Tr n="08" func="Projetista"                      cat="MOI"       disc="Projetos"             pres="Eventual" />
            <Tr n="09" func="Técnico de Segurança"            cat="MOI"       disc="SESMT"                pres="1–2 por obra" />
            <Tr n="10" func="Líder de Elétrica"               cat="MOD"       disc="Elétrica"             pres="1 por frente" />
            <Tr n="11" func="Eletricista"                     cat="MOD"       disc="Elétrica"             pres="Variável" />
            <Tr n="12" func="Líder de Hidráulica"             cat="MOD"       disc="Hidráulica"           pres="1 por frente" />
            <Tr n="13" func="Encanador"                       cat="MOD"       disc="Hidráulica"           pres="Variável" />
            <Tr n="14" func="Ajudante Prático de Obras"       cat="MOD"       disc="Geral"                pres="Variável" />
            <Tr n="15" func="Ajudante"                        cat="MOD"       disc="Geral"                pres="Variável (maior)" />
            <Tr n="16" func="Operador de Equipamento"         cat="MOD"       disc="Mecânica/Civil"       pres="Quando aplicável" />
            <Tr n="17" func="Carpinteiro"                     cat="MOD"       disc="Civil"                pres="Quando aplicável" />
            <Tr n="18" func="Armador"                         cat="MOD"       disc="Estrutural"           pres="Quando aplicável" />
            <Tr n="19" func="Servente"                        cat="MOD"       disc="Geral/Limpeza"        pres="Variável" />
            <Tr n="20" func="Terceiro (Prestador de Serviço)" cat="Terceiros" disc="Variável"             pres="Conforme contrato" />
          </tbody>
        </TabelaScroll>

        <Nota tipo="info" titulo="Dica de padronização — nomenclatura">
          Use exatamente os nomes acima em todos os contratos Sistenge. Permite que o
          RH cruze o efetivo declarado no RDO com a folha ADP e o ponto Pontomais usando
          os mesmos descritores, sem dicionário de equivalências entre obras.
        </Nota>
      </Secao>

      <Secao id="equipamentos" titulo="03 — Equipamentos" sub="Cadastro de equipamentos e máquinas">
        <p>
          No RDO diário, o usuário apenas marca quais equipamentos estão disponíveis ou
          em operação — sem redigitar os nomes.
        </p>

        <h4 className="sub-h">Como cadastrar no sistema</h4>
        <ol className="passos">
          <li><strong>Acesse</strong> <code>Cadastros → Equipamentos</code>.</li>
          <li><strong>Adicione cada equipamento</strong> — clique em "+". Informe nome, tipo/categoria e quantidade disponível (se o sistema permitir).</li>
          <li><strong>Uso no RDO</strong> — campo "Equipamentos" lista todos. Marque os presentes; indique no campo de ocorrências se algum estiver parado e o motivo.</li>
        </ol>

        <h4 className="sub-h">Sugestão de cadastro — Sistenge</h4>

        <h5 className="cat-h">🏗️ Içamento &amp; Transporte</h5>
        <TabelaScroll>
          <thead><tr><th>Equipamento</th><th>Código sugerido</th><th>Obs.</th></tr></thead>
          <tbody>
            <tr><td>Guindaste móvel</td><td><code>EQ-ICÇ-001</code></td><td>Informar capacidade (ton)</td></tr>
            <tr><td>Elevador de obra (cremalheira)</td><td><code>EQ-ICÇ-002</code></td><td>Informar capacidade (kg)</td></tr>
            <tr><td>Carrinho plataforma</td><td><code>EQ-ICÇ-003</code></td><td>—</td></tr>
            <tr><td>Empilhadeira</td><td><code>EQ-ICÇ-004</code></td><td>Quando aplicável</td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">⚡ Elétrica</h5>
        <TabelaScroll>
          <thead><tr><th>Equipamento</th><th>Código</th><th>Obs.</th></tr></thead>
          <tbody>
            <tr><td>Gerador de energia</td><td><code>EQ-ELT-001</code></td><td>Informar potência (kVA)</td></tr>
            <tr><td>Furadeira de impacto</td><td><code>EQ-ELT-002</code></td><td>—</td></tr>
            <tr><td>Alicate crimper / prensador</td><td><code>EQ-ELT-003</code></td><td>—</td></tr>
            <tr><td>Lançadeira de cabos</td><td><code>EQ-ELT-004</code></td><td>—</td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">🔧 Hidráulica</h5>
        <TabelaScroll>
          <thead><tr><th>Equipamento</th><th>Código</th><th>Obs.</th></tr></thead>
          <tbody>
            <tr><td>Máquina de solda HDPE/Vinil</td><td><code>EQ-HID-001</code></td><td>—</td></tr>
            <tr><td>Rosqueadeira elétrica</td><td><code>EQ-HID-002</code></td><td>—</td></tr>
            <tr><td>Bomba de ensaio hidrostático</td><td><code>EQ-HID-003</code></td><td>—</td></tr>
            <tr><td>Maçarico / Kit solda cobre</td><td><code>EQ-HID-004</code></td><td>—</td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">🏛️ Civil &amp; Geral</h5>
        <TabelaScroll>
          <thead><tr><th>Equipamento</th><th>Código</th><th>Obs.</th></tr></thead>
          <tbody>
            <tr><td>Andaime tubular (jogo)</td><td><code>EQ-CIV-001</code></td><td>Informar nº de jogos</td></tr>
            <tr><td>Balancim elétrico</td><td><code>EQ-CIV-002</code></td><td>—</td></tr>
            <tr><td>Serra circular de bancada</td><td><code>EQ-CIV-003</code></td><td>—</td></tr>
            <tr><td>Martelete / Rompedor</td><td><code>EQ-CIV-004</code></td><td>—</td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">🚗 Transporte</h5>
        <TabelaScroll>
          <thead><tr><th>Equipamento</th><th>Código</th><th>Obs.</th></tr></thead>
          <tbody>
            <tr><td>Caminhão / Caminhonete</td><td><code>EQ-TRP-001</code></td><td>Informar placa na obs.</td></tr>
            <tr><td>Van de transporte de pessoal</td><td><code>EQ-TRP-002</code></td><td>—</td></tr>
          </tbody>
        </TabelaScroll>

        <Nota tipo="warn" titulo="Equipamentos parados — registrar sempre">
          Quando um equipamento estiver parado, registrar no campo Ocorrências do RDO:
          nome, motivo, hora de início e previsão de retorno. O cadastro no sistema não
          substitui esse registro narrativo — ele apenas agiliza a listagem do que está
          em obra.
        </Nota>
      </Secao>

      <Secao id="ocorrencias" titulo="04 — Tipos de Ocorrências" sub="Cadastro estratégico jurídico-contratual">
        <p>
          Este é o módulo mais estratégico do ponto de vista jurídico-contratual.
          Categorias padronizadas permitem filtrar, quantificar e analisar
          historicamente os eventos da obra — transformando registros textuais em dados
          analíticos.
        </p>

        <h4 className="sub-h">Como cadastrar no sistema</h4>
        <ol className="passos">
          <li><strong>Acesse</strong> <code>Cadastros → Tipos de ocorrências</code>.</li>
          <li><strong>Crie cada tipo</strong> — clique em "+". Informe o nome do tipo (use exatamente os nomes sugeridos abaixo).</li>
          <li><strong>Uso no RDO</strong> — ao registrar ocorrência, seleciona-se o tipo pré-cadastrado e adiciona descrição detalhada. Permite gerar relatórios por tipo.</li>
        </ol>

        <h4 className="sub-h">Sugestão de cadastro — Sistenge</h4>
        <p className="secao-sub">
          Os tipos abaixo cobrem 100% dos eventos que a Sistenge registra, organizados
          por impacto contratual. Use exatamente estes nomes para consistência entre
          obras.
        </p>

        <h5 className="cat-h">🌧️ Climático</h5>
        <TabelaScroll>
          <thead><tr><th>Tipo</th><th>Quando usar</th><th>Impacto</th></tr></thead>
          <tbody>
            <tr><td><strong>Paralisação Climática — Total</strong></td><td>Chuva ou condição que impediu 100% das atividades no turno.</td><td><Tag tipo="danger">Prorrogação de prazo</Tag></td></tr>
            <tr><td><strong>Paralisação Climática — Parcial</strong></td><td>Chuva que impediu parte das atividades (ex.: externas paradas).</td><td><Tag tipo="danger">Prorrogação de prazo</Tag></td></tr>
            <tr><td><strong>Condição Climática Adversa (sem paralisação)</strong></td><td>Calor extremo, vento forte ou neblina que reduziu produtividade.</td><td><Tag tipo="info">Registro preventivo</Tag></td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">📦 Suprimentos</h5>
        <TabelaScroll>
          <thead><tr><th>Tipo</th><th>Quando usar</th><th>Impacto</th></tr></thead>
          <tbody>
            <tr><td><strong>Falta de Material — Fornecedor</strong></td><td>Atraso de entrega por parte do fornecedor.</td><td><Tag tipo="danger">Defesa de prazo</Tag></td></tr>
            <tr><td><strong>Falta de Material — Contratante</strong></td><td>Material de responsabilidade do cliente não entregue.</td><td><Tag tipo="danger">Defesa de prazo</Tag></td></tr>
            <tr><td><strong>Recebimento de Material</strong></td><td>Chegada de material à obra (nota fiscal, tipo, quantidade).</td><td><Tag tipo="info">Rastreabilidade</Tag></td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">📐 Projeto</h5>
        <TabelaScroll>
          <thead><tr><th>Tipo</th><th>Quando usar</th><th>Impacto</th></tr></thead>
          <tbody>
            <tr><td><strong>Projeto Pendente / Sem Aprovação</strong></td><td>Frente parada por ausência de projeto aprovado ou revisão pendente.</td><td><Tag tipo="danger">Defesa de prazo</Tag></td></tr>
            <tr><td><strong>Conflito Entre Disciplinas</strong></td><td>Interferência entre instalações de disciplinas diferentes.</td><td><Tag tipo="danger">Defesa de prazo</Tag></td></tr>
            <tr><td><strong>Alteração de Projeto pelo Contratante</strong></td><td>Mudança de escopo solicitada pelo cliente durante a execução.</td><td><Tag tipo="warn">Aditivo / Escopo extra</Tag></td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">🔧 Equipamento</h5>
        <TabelaScroll>
          <thead><tr><th>Tipo</th><th>Quando usar</th><th>Impacto</th></tr></thead>
          <tbody>
            <tr><td><strong>Equipamento Parado — Manutenção</strong></td><td>Manutenção preventiva ou corretiva.</td><td><Tag tipo="info">Controle operacional</Tag></td></tr>
            <tr><td><strong>Equipamento Parado — Aguardando Peça</strong></td><td>Equipamento parado por falta de peça de reposição.</td><td><Tag tipo="info">Controle operacional</Tag></td></tr>
            <tr><td><strong>Falha de Infraestrutura Local</strong></td><td>Falta de energia, água, acesso ou infraestrutura.</td><td><Tag tipo="danger">Defesa de prazo</Tag></td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">👷 Pessoal</h5>
        <TabelaScroll>
          <thead><tr><th>Tipo</th><th>Quando usar</th><th>Impacto</th></tr></thead>
          <tbody>
            <tr><td><strong>Ausência de Mão de Obra</strong></td><td>Efetivo abaixo do planejado por falta, atestado ou greve.</td><td><Tag tipo="info">Gestão RH</Tag></td></tr>
            <tr><td><strong>Acidente de Trabalho</strong></td><td>Acidente com lesão. Exige CAT.</td><td><Tag tipo="danger">Legal / SESMT</Tag></td></tr>
            <tr><td><strong>Quase-Acidente / Não Conformidade</strong></td><td>Evento de segurança sem lesão, mas com potencial.</td><td><Tag tipo="warn">Segurança</Tag></td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">📋 Contratual</h5>
        <TabelaScroll>
          <thead><tr><th>Tipo</th><th>Quando usar</th><th>Impacto</th></tr></thead>
          <tbody>
            <tr><td><strong>Solicitação do Contratante</strong></td><td>Pedido verbal ou escrito do cliente.</td><td><Tag tipo="warn">Escopo / Aditivo</Tag></td></tr>
            <tr><td><strong>Visita de Fiscalização Externa</strong></td><td>CREA, MTE, Corpo de Bombeiros, Vigilância Sanitária.</td><td><Tag tipo="warn">Regulatório</Tag></td></tr>
            <tr><td><strong>Retrabalho</strong></td><td>Execução de serviço já realizado por NC ou solicitação.</td><td><Tag tipo="warn">Escopo / Qualidade</Tag></td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">ℹ️ Informativo</h5>
        <TabelaScroll>
          <thead><tr><th>Tipo</th><th>Quando usar</th><th>Impacto</th></tr></thead>
          <tbody>
            <tr><td><strong>Visita Técnica</strong></td><td>Visita de engenheiro, arquiteto, consultor ou representante interno.</td><td><Tag tipo="info">Rastreabilidade</Tag></td></tr>
            <tr><td><strong>Aviso de Prazo Contratual</strong></td><td>Marcos críticos: 90, 60, 30 dias para término.</td><td><Tag tipo="info">Gestão contratual</Tag></td></tr>
          </tbody>
        </TabelaScroll>

        <Nota tipo="info" titulo="Por que isso é estratégico para a Sistenge">
          Com tipos padronizados, o PCO gera relatórios mensais: quantas paralisações
          climáticas por obra, quantos pedidos de alteração, quantos retrabalhos. Esses
          dados sustentam pleitos de aditivo, prorrogação e negociação contratual com
          <strong> dados históricos concretos — não apenas narrativa</strong>.
        </Nota>
      </Secao>

      <Secao id="tarefas" titulo="05 — Lista de Tarefas" sub="Etapas e Atividades">
        <p>
          A Lista de Tarefas é o módulo de maior impacto no acompanhamento físico da
          obra. Estrutura os serviços em hierarquia de dois níveis — <strong>Etapas</strong>
          {' '}(grandes fases) e <strong>Atividades</strong> (serviços específicos) — que
          aparecem como seleção rápida no RDO.
        </p>

        <Nota tipo="info" titulo="Estrutura hierárquica">
          <p><strong>📁 Etapa (nível 1)</strong> — grande fase ou disciplina da obra (ex.: "Instalações Elétricas"). Configurada uma vez por obra.</p>
          <p><strong>📄 Atividade (nível 2)</strong> — serviço específico dentro da etapa (ex.: "Lançamento de cabos alimentadores"). Selecionada no RDO diário. Cada atividade tem status: A fazer / Em andamento / Concluída.</p>
        </Nota>

        <h4 className="sub-h">Como cadastrar etapas</h4>
        <ol className="passos">
          <li><strong>Acesse</strong> <code>Lista de tarefas</code> na barra lateral.</li>
          <li><strong>Adicione uma nova etapa</strong> — clique no botão de adicionar. Informe o nome (use os nomes sugeridos abaixo).</li>
          <li><strong>Dentro de cada etapa, cadastre as atividades</strong> — clique na etapa criada e adicione os serviços.</li>
        </ol>

        <h4 className="sub-h">Como cadastrar atividades</h4>
        <ol className="passos">
          <li><strong>Adicione atividades dentro da etapa</strong> — siga o padrão: verbo no particípio + complemento + localização genérica.</li>
          <li><strong>Status</strong> — A fazer / Em andamento / Concluída. Atualizado no RDO diário.</li>
          <li><strong>Uso no RDO</strong> — as tarefas cadastradas aparecem como sugestão de seleção rápida.</li>
        </ol>

        <h4 className="sub-h">Sugestão de cadastro — Sistenge</h4>

        <h5 className="cat-h">⚡ Etapa 1 — Instalações Elétricas</h5>
        <TabelaScroll>
          <thead><tr><th>#</th><th>Atividade</th><th>Fase</th></tr></thead>
          <tbody>
            <tr><td>1.1</td><td>Instalações elétricas — infraestrutura dos alimentadores</td><td>Inicial</td></tr>
            <tr><td>1.2</td><td>Instalações elétricas — lançamento de cabos alimentadores de painéis</td><td>Intermediária</td></tr>
            <tr><td>1.3</td><td>Instalações elétricas — organização de cabos alimentadores</td><td>Intermediária</td></tr>
            <tr><td>1.4</td><td>Instalações elétricas — montagem de infraestrutura de cabeamento estruturado</td><td>Intermediária</td></tr>
            <tr><td>1.5</td><td>Instalações elétricas — lançamento de cabos de iluminação e tomadas</td><td>Intermediária</td></tr>
            <tr><td>1.6</td><td>Instalações elétricas — montagem de infraestrutura de painéis</td><td>Intermediária</td></tr>
            <tr><td>1.7</td><td>Instalações elétricas — montagem de painel elétrico</td><td>Final</td></tr>
            <tr><td>1.8</td><td>Instalações elétricas — ligação e energização de painéis</td><td>Final</td></tr>
            <tr><td>1.9</td><td>Instalações elétricas — instalação de luminárias</td><td>Final</td></tr>
            <tr><td>1.10</td><td>Instalações elétricas — instalação de tomadas e interruptores</td><td>Final</td></tr>
            <tr><td>1.11</td><td>Instalações elétricas — aterramento (cabo de cobre NU)</td><td>Específica</td></tr>
            <tr><td>1.12</td><td>Instalações elétricas — infraestrutura chamada de enfermagem</td><td>Específica</td></tr>
            <tr><td>1.13</td><td>Instalações elétricas — testes e comissionamento</td><td>Final</td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">💧 Etapa 2 — Instalações Hidráulicas</h5>
        <TabelaScroll>
          <thead><tr><th>#</th><th>Atividade</th><th>Fase</th></tr></thead>
          <tbody>
            <tr><td>2.1</td><td>Instalações hidráulicas — instalação de tubulação água fria</td><td>Inicial/Interm.</td></tr>
            <tr><td>2.2</td><td>Instalações hidráulicas — tubulação água pluvial Vinil Fort</td><td>Inicial/Interm.</td></tr>
            <tr><td>2.3</td><td>Instalações hidráulicas — rede de esgoto</td><td>Inicial/Interm.</td></tr>
            <tr><td>2.4</td><td>Instalações hidráulicas — dreno de ar-condicionado</td><td>Intermediária</td></tr>
            <tr><td>2.5</td><td>Instalações hidráulicas — tubulação de água quente</td><td>Intermediária</td></tr>
            <tr><td>2.6</td><td>Instalações hidráulicas — ramal de alimentação Barrilete</td><td>Específica</td></tr>
            <tr><td>2.7</td><td>Instalações hidráulicas — instalação de registros e válvulas</td><td>Final</td></tr>
            <tr><td>2.8</td><td>Instalações hidráulicas — instalação de louças e metais</td><td>Final</td></tr>
            <tr><td>2.9</td><td>Instalações hidráulicas — teste de estanqueidade</td><td>Final</td></tr>
            <tr><td>2.10</td><td>Instalações hidráulicas — revisão e ajustes (solicitação do contratante)</td><td>Qualquer</td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">🏗️ Etapa 3 — Obras Civis e Complementares</h5>
        <TabelaScroll>
          <thead><tr><th>#</th><th>Atividade</th><th>Fase</th></tr></thead>
          <tbody>
            <tr><td>3.1</td><td>Obras civis — rasgos e cortes para passagem de tubulação</td><td>Inicial</td></tr>
            <tr><td>3.2</td><td>Obras civis — chumbamento de eletrodutos e tubulações</td><td>Intermediária</td></tr>
            <tr><td>3.3</td><td>Obras civis — fechamento de rasgos e recomposição</td><td>Final</td></tr>
            <tr><td>3.4</td><td>Obras civis — limpeza e organização do canteiro</td><td>Contínua</td></tr>
          </tbody>
        </TabelaScroll>

        <h5 className="cat-h">⚙️ Etapa 4 — Gestão e Administração da Obra</h5>
        <TabelaScroll>
          <thead><tr><th>#</th><th>Atividade</th><th>Quando usar</th></tr></thead>
          <tbody>
            <tr><td>4.1</td><td>Recebimento e conferência de material</td><td>Entrega de materiais</td></tr>
            <tr><td>4.2</td><td>Reunião técnica com contratante</td><td>Reuniões de obra</td></tr>
            <tr><td>4.3</td><td>Visita técnica de engenheiro responsável</td><td>Visitas técnicas</td></tr>
            <tr><td>4.4</td><td>As-built e levantamento de campo</td><td>Documentação final</td></tr>
            <tr><td>4.5</td><td>Elaboração e entrega de documentação técnica</td><td>Entrega de docs</td></tr>
          </tbody>
        </TabelaScroll>

        <Nota tipo="warn" titulo="Atividades administrativas no RDO">
          Reuniões, visitas e recebimento de materiais devem ser registrados tanto na
          Lista de Tarefas quanto no campo de <strong>Ocorrências</strong> do RDO (com
          detalhe narrativo). A tarefa captura o "o quê"; a ocorrência captura o "como,
          quem e qual impacto".
        </Nota>
      </Secao>

      <Secao id="ordem" titulo="06 — Ordem de Implementação" sub="Sequência correta de configuração">
        <p>
          Os cadastros devem ser feitos <strong>antes do primeiro RDO da obra</strong>,
          na sequência abaixo. Cada módulo depende do anterior para funcionar
          corretamente no RDO diário.
        </p>

        <h4 className="sub-h">1º — Antes de qualquer coisa</h4>
        <ul className="exemplos">
          <li><strong>Cadastro de Mão de Obra</strong> — funções/cargos que operam na obra.</li>
          <li><strong>Cadastro de Equipamentos</strong> — máquinas e ferramentas presentes.</li>
          <li><strong>Tipos de Ocorrências</strong> — categorias para classificação de eventos.</li>
        </ul>

        <h4 className="sub-h">2º — Configuração da obra</h4>
        <ul className="exemplos">
          <li><strong>Lista de Tarefas — Etapas</strong> — grandes fases/disciplinas.</li>
          <li><strong>Lista de Tarefas — Atividades</strong> — serviços específicos dentro de cada etapa.</li>
        </ul>

        <h4 className="sub-h">3º — Operação diária</h4>
        <ul className="exemplos">
          <li><strong>Criar RDO do dia</strong> — com cadastros prontos, preenchimento é seleção rápida.</li>
          <li><strong>Atualizar status das tarefas</strong> — marcar concluídas para o painel ficar atualizado.</li>
          <li><strong>Aprovar e arquivar</strong> — fluxo Supervisor → Gerente → Cliente.</li>
        </ul>

        <h4 className="sub-h">Reutilização entre contratos</h4>
        <TabelaScroll>
          <thead>
            <tr><th>Módulo</th><th>Escopo</th><th>Quem configura</th><th>Quando</th><th>Revisar quando</th></tr>
          </thead>
          <tbody>
            <tr><td>Mão de Obra</td><td><Tag tipo="info">Corporativo</Tag></td><td>Gerente do Contrato ou Resp. Operacional</td><td>Uma vez — antes do 1º RDO</td><td>Novo cargo ou função</td></tr>
            <tr><td>Equipamentos</td><td><Tag tipo="info">Corporativo</Tag></td><td>Gerente do Contrato ou Resp. Operacional</td><td>Uma vez — antes do 1º RDO</td><td>Novo equipamento mobilizado</td></tr>
            <tr><td>Tipos de Ocorrências</td><td><Tag tipo="info">Corporativo</Tag></td><td>Gerente do Contrato ou Engenharia</td><td>Uma vez — padrão da empresa</td><td>Raramente (com aprovação da Engenharia)</td></tr>
            <tr><td>Tarefas — Etapas</td><td><Tag tipo="warn">Por obra</Tag></td><td>Gerente do Contrato</td><td>Na abertura da obra</td><td>Mudança de escopo</td></tr>
            <tr><td>Tarefas — Atividades</td><td><Tag tipo="warn">Por obra</Tag></td><td>Supervisor + Gerente</td><td>Na abertura da obra</td><td>Novo serviço ou fase</td></tr>
          </tbody>
        </TabelaScroll>
      </Secao>

      <Secao id="links" titulo="07 — Links de Treinamento" sub="Central de treinamento por módulo">
        <p>
          Cada módulo tem vídeos de treinamento em versão web e app. Acesso gratuito
          para usuários cadastrados. Assistir é pré-requisito antes do primeiro acesso
          ao sistema.
        </p>

        <TabelaScroll>
          <thead>
            <tr><th>Módulo</th><th>Duração (web)</th><th>Duração (app)</th><th>Perfil obrigatório</th></tr>
          </thead>
          <tbody>
            <tr><td>Mão de Obra</td><td>3min 33s</td><td>3min 33s</td><td>Resp. Operacional · Supervisor</td></tr>
            <tr><td>Equipamentos</td><td>58s</td><td>58s</td><td>Resp. Operacional · Supervisor</td></tr>
            <tr><td>Tipos de Ocorrências</td><td>1min</td><td>1min</td><td>Supervisor · Gerente</td></tr>
            <tr><td>Lista de Tarefas — Visão geral</td><td>57s</td><td>56s</td><td>Resp. Operacional · Supervisor · Gerente</td></tr>
            <tr><td>Lista de Tarefas — Etapas</td><td>42s</td><td>42s</td><td>Supervisor · Gerente</td></tr>
            <tr><td>Lista de Tarefas — Atividades</td><td>57s</td><td>57s</td><td>Resp. Operacional · Supervisor · Gerente</td></tr>
          </tbody>
        </TabelaScroll>

        <Nota tipo="info" titulo="Central completa de treinamento">
          Todos os módulos disponíveis (criação de RDO, aprovações, relatórios,
          exportação PDF) estão em{' '}
          <a href="https://diariodeobras.net/treinamento/" target="_blank" rel="noreferrer">
            diariodeobras.net/treinamento/
          </a>.
        </Nota>
      </Secao>
    </>
  );
}

/* ─── Componentes auxiliares ──────────────────────────────────── */

function Secao({ id, titulo, sub, children }) {
  return (
    <section id={id} className="treinamento-secao">
      <h2>{titulo}</h2>
      {sub && <p className="secao-sub">{sub}</p>}
      {children}
    </section>
  );
}

function CardModulo({ emoji, titulo, menu, desc, duracao }) {
  return (
    <div className="card-modulo">
      <div className="card-emoji">{emoji}</div>
      <h4>{titulo}</h4>
      <code className="card-menu">{menu}</code>
      <p>{desc}</p>
      <span className="card-duracao">⏱ {duracao}</span>
    </div>
  );
}

function TabelaScroll({ children }) {
  return (
    <div className="tabela-scroll">
      <table>{children}</table>
    </div>
  );
}

function Tag({ tipo = 'info', children }) {
  return <span className={`tag tag-${tipo}`}>{children}</span>;
}

function Nota({ tipo = 'info', titulo, children }) {
  return (
    <div className={`nota-callout nota-${tipo}`}>
      {titulo && <strong>{titulo}</strong>}
      <div>{children}</div>
    </div>
  );
}

function Tr({ n, func, cat, disc, pres }) {
  return (
    <tr>
      <td>{n}</td>
      <td><strong>{func}</strong></td>
      <td>{cat}</td>
      <td>{disc}</td>
      <td>{pres}</td>
    </tr>
  );
}
