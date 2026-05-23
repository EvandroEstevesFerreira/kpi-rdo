// Manual de Preenchimento do RDO — Sistenge — v1.1 Mai/2026

export default function ManualRDO() {
  return (
    <>
      <Secao id="objetivo" titulo="01 — Objetivo & Contexto" sub="Por que o RDO é estratégico?">
        <p>
          O Relatório Diário de Obra é o principal instrumento de registro, controle e
          defesa jurídica da Sistenge na execução de contratos de engenharia. Preenchê-lo
          corretamente <strong>não é burocracia — é gestão de risco</strong>.
        </p>

        <div className="card-grid">
          <CardInfo emoji="⚖️" titulo="Proteção Jurídica">
            Fundamenta pleitos contratuais, defesas em autuações trabalhistas, perícias
            e acionamento de seguros de engenharia.
          </CardInfo>
          <CardInfo emoji="📈" titulo="Controle de Produtividade">
            Cruzamento do efetivo declarado com ponto eletrônico e medições mensais para
            identificar desvios e ineficiências.
          </CardInfo>
          <CardInfo emoji="📋" titulo="Base para Medições">
            Histórico diário de serviços executados sustenta quantitativos de medição,
            boletins de avanço físico e faturamento.
          </CardInfo>
          <CardInfo emoji="👷" titulo="Gestão de Efetivo">
            Headcount diário por função permite conferência cruzada com folha de
            pagamento, ponto eletrônico e encargos trabalhistas.
          </CardInfo>
          <CardInfo emoji="🌧️" titulo="Evidência Climática">
            Registro de condições impeditivas (chuva, vento, temperatura) sustenta
            pleitos de prorrogação de prazo contratual.
          </CardInfo>
          <CardInfo emoji="📚" titulo="Memória Técnica">
            Histórico imutável e rastreável da obra para referência em garantias,
            manutenção, certificações e auditorias futuras.
          </CardInfo>
        </div>
      </Secao>

      <Secao id="responsabilidades" titulo="02 — Responsabilidades" sub="Quem faz o quê?">
        <p>
          O fluxo de responsabilidades é fixo para todos os contratos Sistenge. Cada
          função tem papel, prazo e consequência definidos. A ausência de qualquer
          etapa fragiliza o valor probatório do documento.
        </p>

        <TabelaScroll>
          <thead>
            <tr>
              <th>Função</th>
              <th>Papel</th>
              <th>Ação no sistema</th>
              <th>Prazo</th>
              <th>Responsabilidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Aux./Assistente de Engenharia ou Apontador</strong></td>
              <td>Responsável Operacional — cria o RDO, lança atividades, efetivo, clima, equipamentos e fotos.</td>
              <td>Criar RDO, preencher, fazer upload de fotos, submeter para aprovação.</td>
              <td>Mesmo dia — até 17h30</td>
              <td><Tag tipo="info">Operacional</Tag></td>
            </tr>
            <tr>
              <td><strong>Supervisor da Obra</strong></td>
              <td>Aprovador 1 — valida informações de campo, confere efetivo, atividades e ocorrências.</td>
              <td>Revisar e aprovar (ou devolver com comentário).</td>
              <td>D+1 — até 12h</td>
              <td><Tag tipo="info">Técnico</Tag></td>
            </tr>
            <tr>
              <td><strong>Gerente do Contrato / Engenharia</strong></td>
              <td>Aprovador 2 — confirmação gerencial e consistência com planejamento.</td>
              <td>Aprovar RDO e confirmar envio ao contratante.</td>
              <td>D+2 — até 17h</td>
              <td><Tag tipo="warn">Gerencial</Tag></td>
            </tr>
            <tr>
              <td><strong>Cliente / Fiscalização</strong></td>
              <td>Aprovador 3 — atesta serviços executados em nome do contratante.</td>
              <td>Aprovar RDO no sistema (acesso de cliente).</td>
              <td>Até D+7</td>
              <td><Tag tipo="warn">Contratual</Tag></td>
            </tr>
            <tr>
              <td><strong>Engenheiro Responsável Técnico</strong></td>
              <td>Responsabilidade legal — vinculado à ART do contrato.</td>
              <td>—</td>
              <td>—</td>
              <td><Tag tipo="danger">ART / Legal</Tag></td>
            </tr>
          </tbody>
        </TabelaScroll>

        <Nota tipo="warn" titulo="Regra importante — substituição de aprovadores">
          Em caso de ausência do Aprovador 1 ou 2, o substituto designado deve constar
          nominalmente no campo de ocorrências do RDO naquele dia, para registro de quem
          exerceu a função temporariamente.
        </Nota>
      </Secao>

      <Secao id="fluxo" titulo="03 — Fluxo de Aprovação" sub="Ciclo de vida do RDO">
        <p>
          Da criação à aprovação final, cada etapa tem responsável, prazo e
          consequência. O RDO só tem validade plena quando aprovado pelo cliente.
        </p>

        <PassoFluxo n="1" titulo="Registro no campo" prazo="Resp. operacional · Mesmo dia até 17h30">
          O Auxiliar/Assistente de Engenharia ou Apontador cria o RDO no app ou web com
          todas as atividades do dia, efetivo por função, condição climática em dois
          turnos, equipamentos e fotos georreferenciadas com legenda. Após preenchimento
          completo, submete para aprovação.
        </PassoFluxo>
        <PassoFluxo n="2" titulo="Aprovação 1 — Supervisor da Obra" prazo="D+1 — até 12h">
          Valida as informações de campo. Verifica se todas as frentes de serviço foram
          registradas com localização precisa. Confirma efetivo e ocorrências. Pode
          devolver com comentário caso haja inconsistência.
        </PassoFluxo>
        <PassoFluxo n="3" titulo="Aprovação 2 — Gerente do Contrato" prazo="D+2 — até 17h">
          Confirma consistência gerencial com o planejamento, cronograma e medição.
          Verifica ocorrências que possam impactar prazo ou custo contratual. Após
          aprovação, o RDO é disponibilizado ao cliente para aprovação final.
        </PassoFluxo>
        <PassoFluxo n="4" titulo="Aprovação 3 — Cliente / Fiscalização" prazo="Até D+7 — cobrar formalmente">
          O representante do contratante acessa o sistema e aprova os serviços. RDOs sem
          aprovação até D+7 devem ser cobrados por e-mail formal, com cópia ao Gerente
          do Contrato, para fins de medição e eventual pleito contratual.
        </PassoFluxo>
        <PassoFluxo n="5" titulo="Arquivamento & Consolidação" prazo="Engenharia / RH / PCO · Mensal e contínuo">
          RDOs aprovados alimentam o Boletim de Avanço Físico, o relatório mensal ao
          cliente e os indicadores de PCO. O RH utiliza o headcount declarado para
          conferência com o ponto eletrônico. <strong>Guarda mínima: 5 anos após o
          encerramento do contrato.</strong>
        </PassoFluxo>
      </Secao>

      <Secao id="campos" titulo="04 — Campos do Sistema" sub="O que preencher em cada campo?">
        <p>
          O sistema diariodeobras.net possui módulos específicos. Abaixo o detalhamento
          de cada campo, com grau de obrigatoriedade e orientação de preenchimento.
        </p>

        <Campo nivel="obrigatorio" titulo="Identificação do RDO">
          Número sequencial (sem lacunas), data, dia da semana, contrato, obra, endereço
          e responsável técnico. Deve ser idêntico ao cadastro contratual.
          <Exemplo>RDO nº 544 | 07/05/2026 | Quinta-Feira | Contrato 605</Exemplo>
        </Campo>
        <Campo nivel="obrigatorio" titulo="Condição climática">
          Registrar manhã e tarde com tempo (Claro / Nublado / Chuvoso) e praticabilidade.
          Em caso de chuva, informar hora de início e retomada das atividades.
          <Exemplo>Manhã — Chuvoso — Impraticável (07h–10h30). Tarde — Claro — Praticável.</Exemplo>
        </Campo>
        <Campo nivel="obrigatorio" titulo="Mão de obra">
          Registrar <strong>TODOS</strong> os profissionais por função, separando MOD
          (produção), MOI (apoio/adm) e Terceiros. Incluir totais por categoria. Deve
          espelhar o ponto eletrônico.
          <Exemplo>Eletricista (14) | Encanador (5) | Técnico de Segurança (2) | Almoxarife (1) — Total: 66</Exemplo>
        </Campo>
        <Campo nivel="obrigatorio" titulo="Atividades executadas">
          Descrever cada serviço com disciplina, ação (verbo no particípio),
          componente/sistema, localização (pavimento/setor) e status. Um item por linha.
          Incluir quantitativo quando possível.
          <Exemplo>"Inst. elétricas — lançamento de cabos QGBT-ILT-8PV — 8º pavimento — Em andamento."</Exemplo>
        </Campo>
        <Campo nivel="obrigatorio" titulo="Fotografias">
          Mínimo de 4 fotos por frente de serviço, com geolocalização ativa e data/hora
          visível (watermark automático do app). Cada foto deve ter legenda descritiva
          no padrão Sistenge. Verificar que todas carregaram antes de fechar o RDO.
          <Exemplo>Legenda: "Inst. elétricas — org. de cabos QGBT-EST — sala elétrica — 8º pavimento"</Exemplo>
        </Campo>
        <Campo nivel="recomendado" titulo="Horário de trabalho">
          Registrar hora de início, intervalo e encerramento. Fundamental em processos
          trabalhistas sobre jornada e horas extras.
          <Exemplo>Início: 07h30 | Intervalo: 12h–13h | Término: 17h30 | Total: 9h</Exemplo>
        </Campo>
        <Campo nivel="recomendado" titulo="Equipamentos">
          Listar equipamentos presentes com status: disponível, em operação ou parado.
          Para parados, informar motivo.
          <Exemplo>Andaime tubular (4 jogos — operando) | Serra circular (1 — parada — manutenção)</Exemplo>
        </Campo>
        <Campo nivel="obrigatorio" titulo="Ocorrências">
          Registrar tudo que fugiu do planejado: acidentes, quase-acidentes,
          paralisações, pedidos do cliente, visitas de fiscalização, atrasos de material
          ou projeto, falhas de equipamento, interferências.
          <Exemplo>"Revisão hidráulica solicitada verbalmente pelo fiscal do contratante — 3º pavimento — 14h00."</Exemplo>
        </Campo>
      </Secao>

      <Secao id="padrao-escrita" titulo="05 — Padrão de Escrita" sub="Como descrever as atividades">
        <p>
          O campo de atividades é o mais consultado em medições, perícias e auditorias.
          A fórmula abaixo garante clareza, rastreabilidade e valor probatório.
        </p>

        <div className="formula-box">
          <span className="formula-label">Fórmula padrão Sistenge — campo de atividades</span>
          <code>
            [Disciplina] — [Serviço: verbo no particípio] — [Componente/sistema] — [Localização] — [Status] — [Quantidade]
          </code>
        </div>

        <TabelaScroll>
          <thead>
            <tr>
              <th>Componente</th>
              <th>O que informar</th>
              <th>Exemplo correto</th>
              <th>Erro comum</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Disciplina</td><td>Instalações elétricas / hidráulicas / civil / SPDA / CFTV / Estrutural</td><td>"Instalações hidráulicas"</td><td>"Elétrica" (incompleto)</td></tr>
            <tr><td>Serviço</td><td>Verbo no particípio descrevendo a ação executada</td><td>"lançamento de cabos" / "instalação de tubulação"</td><td>"trabalhou" / "fez serviços"</td></tr>
            <tr><td>Componente</td><td>Código ou nome técnico do elemento</td><td>"QGBT-ILT-8PV" / "tubulação Vinil Fort DN 100"</td><td>"painel elétrico" (genérico)</td></tr>
            <tr><td>Localização</td><td>Pavimento, subsolo, eixo, setor ou área do projeto</td><td>"8º pavimento" / "Barrilete / Setor A"</td><td>"na obra" / "no prédio"</td></tr>
            <tr><td>Status</td><td>Em andamento / Concluído / Pendente / Aguardando material</td><td>"Em andamento" / "Concluído"</td><td>Campo em branco</td></tr>
            <tr><td>Quantidade</td><td>m, un, m², m³ executados no dia</td><td>"52 m de cabo 70mm²" / "3 pontos instalados"</td><td>Sem informação</td></tr>
          </tbody>
        </TabelaScroll>

        <h4 className="sub-h">Exemplos de descrições corretas</h4>
        <ul className="exemplos">
          <li><strong>Elétrica:</strong> "Instalações elétricas — lançamento de cabos alimentadores do painel QGBT-EST-1SS — 1º subsolo — Em andamento — aprox. 48m de cabo 95mm²."</li>
          <li><strong>Hidráulica:</strong> "Instalações hidráulicas — instalação de tubulação água fria Vinil Fort — Barrilete — Concluído — 12m de tubo DN 50."</li>
          <li><strong>Revisão do cliente:</strong> "Instalações hidráulicas — revisão de caimento da calha pluvial a pedido da fiscalização — 3º pavimento — Concluído."</li>
        </ul>
      </Secao>

      <Secao id="roteiro" titulo="06 — Roteiro de Ocorrências" sub="O que registrar em cada situação?">
        <p>
          Este roteiro orienta o que incluir no RDO em cada tipo de evento que impacta a
          obra. Todo fato que fuja do planejado deve ser registrado — inclusive os
          positivos. O campo de ocorrências é o mais consultado em disputas contratuais.
        </p>

        <Ocorrencia emoji="🌧️" titulo="Paralisação por condição climática" tag="Prazo / Prorrogação">
          <p>Toda paralisação por chuva, vento forte ou condição impeditiva deve ser registrada com horário exato.</p>
          <Modelo>Paralisação total das atividades em razão de chuva intensa a partir das [HH:MM]. Retomada dos serviços às [HH:MM]. Total de horas improdutivas: [X]h. Registrado em condição climática: Impraticável.</Modelo>
          <ul className="chips">
            <li><strong>Campo climático:</strong> Chuvoso — Impraticável (manhã e/ou tarde)</li>
            <li><strong>Ocorrências:</strong> hora de início, retomada e total de horas paradas</li>
            <li><strong>Fotografia:</strong> chuva/água acumulada com data e hora visível</li>
            <li><strong>Impacto:</strong> indicar se houve atraso no cronograma do dia</li>
          </ul>
        </Ocorrencia>

        <Ocorrencia emoji="📦" titulo="Paralisação ou redução de ritmo por falta de material" tag="Suprimentos">
          <p>Falta de material que impede ou reduz a execução deve ser registrada com especificação, frente afetada e quem foi comunicado.</p>
          <Modelo>Paralisação/redução de ritmo na frente de [disciplina] — [localização] por falta de [material/insumo]. Quantidade necessária: [X]. Solicitação de compra/entrega realizada em [data] pelo [responsável]. Frente remanejada para [outra atividade].</Modelo>
          <ul className="chips">
            <li><strong>Atividade afetada:</strong> registrar status "Aguardando material"</li>
            <li><strong>Material em falta:</strong> nome técnico, código e quantidade</li>
            <li><strong>Comunicação:</strong> quem foi comunicado (suprimentos, cliente)</li>
            <li><strong>Remanejamento:</strong> atividade alternativa no período</li>
          </ul>
        </Ocorrencia>

        <Ocorrencia emoji="👷" titulo="Ausência ou redução de mão de obra" tag="Pessoal">
          <p>Efetivo abaixo do planejado por falta, afastamento, acidente ou problema de terceiro deve ser registrado com a diferença e o impacto.</p>
          <Modelo>Efetivo reduzido em relação ao planejado. Ausências: [X] profissionais da função [cargo] por [motivo]. Efetivo planejado: [XX]. Efetivo presente: [XX]. Impacto: [frente afetada / atraso estimado].</Modelo>
          <ul className="chips">
            <li><strong>Mão de obra:</strong> registrar apenas o efetivo efetivamente presente</li>
            <li><strong>Função ausente:</strong> qual função e quantos profissionais</li>
            <li><strong>Motivo:</strong> causa da ausência, se conhecida</li>
            <li><strong>Impacto:</strong> frentes paradas ou com ritmo reduzido</li>
          </ul>
        </Ocorrencia>

        <Ocorrencia emoji="📋" titulo="Solicitação ou instrução do cliente/fiscalização" tag="Contratual">
          <p>Todo pedido do cliente — verbal ou escrito — deve ser registrado no RDO no mesmo dia. Transforma uma instrução informal em registro formal.</p>
          <Modelo>Solicitação verbal/escrita do representante do contratante [cargo/nome] às [HH:MM]: [descrever o que foi solicitado] — Localização: [pavimento/setor]. Serviço realizado conforme orientação. [Ou: Aguardando formalização por escrito.]</Modelo>
          <ul className="chips">
            <li><strong>Identificação:</strong> cargo do representante que solicitou</li>
            <li><strong>Horário:</strong> hora exata da solicitação</li>
            <li><strong>Descrição:</strong> o que foi pedido, sem ambiguidade</li>
            <li><strong>Status:</strong> executado ou aguarda formalização</li>
          </ul>
        </Ocorrencia>

        <Ocorrencia emoji="📐" titulo="Projeto incompleto, conflito ou sem aprovação" tag="Contratual">
          <p>Quando a frente está impedida por falta de projeto aprovado, revisão pendente ou conflito entre disciplinas. Sustenta pleito de prorrogação.</p>
          <Modelo>Frente de [disciplina] — [localização] paralisada aguardando [projeto aprovado / revisão / definição do contratante sobre interferência entre [A] e [B]]. Comunicado ao contratante em [data] via [canal]. Protocolada sob [referência].</Modelo>
          <ul className="chips">
            <li><strong>Frente afetada:</strong> disciplina e localização exata</li>
            <li><strong>Impedimento:</strong> descrever o conflito ou pendência</li>
            <li><strong>Comunicação:</strong> como e quando o cliente foi informado</li>
            <li><strong>Alternativa:</strong> para onde a equipe foi remanejada</li>
          </ul>
        </Ocorrencia>

        <Ocorrencia emoji="⚠️" titulo="Acidente, quase-acidente ou não conformidade" tag="Segurança">
          <p>Todo evento de segurança — mesmo quase-acidente sem lesão — deve ser registrado com detalhamento. Reduz exposição em autuações trabalhistas.</p>
          <Modelo>[Acidente / Quase-acidente / Não conformidade] às [HH:MM] em [localização]. Descrição: [detalhar]. Envolvidos: [função, sem nome no RDO]. Ação imediata: [primeiros socorros / paralisação / isolamento / acionamento SESMT]. Registro de CAT: [Sim/Não/Em andamento].</Modelo>
          <ul className="chips">
            <li><strong>Horário:</strong> hora exata do evento</li>
            <li><strong>Localização:</strong> pavimento e área específica</li>
            <li><strong>Ação:</strong> o que foi feito imediatamente</li>
            <li><strong>Fotografia:</strong> fotografar o local ANTES da intervenção</li>
          </ul>
        </Ocorrencia>

        <Ocorrencia emoji="🏛️" titulo="Visita de fiscalização, auditoria ou inspeção externa" tag="Regulatório">
          <p>Visitas de CREA, MTE, Vigilância Sanitária, Corpo de Bombeiros ou cliente devem ser registradas. Omitir pode ser interpretado como ocultação.</p>
          <Modelo>Visita de fiscalização realizada por [órgão/empresa] às [HH:MM]. Representante(s): [cargo(s)]. Itens verificados: [áreas/sistemas/documentos]. Apontamentos: [descrever]. Prazo para atendimento: [data]. Documentação entregue: [listar].</Modelo>
          <ul className="chips">
            <li><strong>Órgão visitante:</strong> nome do órgão ou empresa</li>
            <li><strong>Horário:</strong> entrada e saída da fiscalização</li>
            <li><strong>Apontamentos:</strong> exigências ou recomendações</li>
            <li><strong>Prazo:</strong> data limite para atendimento</li>
          </ul>
        </Ocorrencia>

        <Ocorrencia emoji="🔧" titulo="Equipamento parado ou falha de infraestrutura" tag="Operacional">
          <p>Paralisação de guindaste, gerador, betoneira ou qualquer equipamento crítico deve constar com impacto declarado.</p>
          <Modelo>[Equipamento] parado desde [HH:MM] por [falha mecânica/elétrica/manutenção/aguardando peça]. Frentes impactadas: [listar]. Manutenção acionada em [HH:MM]. Previsão de retorno: [data/hora]. Remanejamento para: [atividade].</Modelo>
          <ul className="chips">
            <li><strong>Equipamento:</strong> nome e identificação</li>
            <li><strong>Causa:</strong> motivo da parada</li>
            <li><strong>Frentes:</strong> quais atividades foram impactadas</li>
            <li><strong>Ação:</strong> o que foi feito para resolver</li>
          </ul>
        </Ocorrencia>

        <Ocorrencia emoji="📅" titulo="Advertência de prazo contratual crítico" tag="Prazo">
          <p>Quando o prazo a vencer atingir 90, 60 e 30 dias restantes, o RDO deve conter observação explícita. Demonstra ciência e providências da equipe.</p>
          <Modelo>Informativo de prazo: restam [X] dias para o término contratual previsto em [data]. Atividades críticas pendentes: [listar]. Medidas de aceleração em andamento: [listar]. Pendências do contratante: [listar].</Modelo>
        </Ocorrencia>
      </Secao>

      <Secao id="faca-naofaca" titulo="07 — Faça / Não Faça" sub="Boas práticas e erros críticos">
        <div className="faca-naofaca">
          <div className="faca">
            <h4>✅ Faça — boas práticas</h4>
            <ul>
              <li>Preencha o RDO no mesmo dia, até 17h30. RDO retroativo perde valor probatório.</li>
              <li>Registre condição climática com praticabilidade em dois turnos.</li>
              <li>Liste todo o efetivo por função — espelhe o ponto eletrônico.</li>
              <li>Inclua localização precisa em cada atividade (pavimento, eixo, setor).</li>
              <li>Fotografe antes, durante e depois de cada serviço relevante.</li>
              <li>Registre pedidos verbais do cliente no campo de ocorrências no mesmo dia.</li>
              <li>Informe paralisações por chuva com hora de início e retomada.</li>
              <li>Inclua quantitativos (metros, pontos, unidades) sempre que possível.</li>
              <li>Registre visitas de fiscalização externa com detalhamento.</li>
              <li>Cobre aprovação do cliente em até D+7 por e-mail formal com cópia ao Gerente.</li>
              <li>Verifique se todas as fotos carregaram antes de fechar o RDO.</li>
              <li>Registre retrabalhos com causa, área afetada e quem solicitou.</li>
            </ul>
          </div>
          <div className="naofaca">
            <h4>⛔ Não faça — erros críticos</h4>
            <ul>
              <li>Nunca preencha RDO de dias anteriores sem nota de retificação datada.</li>
              <li>Não deixe campos de mão de obra em branco ou sem função especificada.</li>
              <li>Não registre atividades sem localização ("trabalhando na obra" não tem valor).</li>
              <li>Não omita paralisações, mesmo que breves.</li>
              <li>Não altere RDOs já aprovados — use addendum no RDO do dia seguinte.</li>
              <li>Não use "em andamento" para serviços concluídos.</li>
              <li>Não ignore pedidos verbais do cliente.</li>
              <li>Não faça upload de fotos sem legenda.</li>
              <li>Não declare efetivo diferente do ponto eletrônico.</li>
              <li>Não deixe RDOs na fila por mais de 7 dias sem cobrança formal.</li>
              <li>Não use descrições genéricas como "serviços gerais".</li>
              <li>Não omita quase-acidentes ou não conformidades de segurança.</li>
            </ul>
          </div>
        </div>
      </Secao>

      <Secao id="fotografia" titulo="08 — Fotografia de Obra" sub="Padrão fotográfico Sistenge">
        <p>
          A documentação fotográfica é a segunda linha de defesa após o texto do RDO.
          Volume alto de fotos com legendas corretas e geolocalização ativa é o padrão
          mínimo esperado.
        </p>

        <div className="card-grid">
          <CardInfo emoji="📸" titulo="Mínimo por frente de serviço">
            4 fotos: visão geral antes, detalhe durante, visão geral após e close do
            elemento instalado (placa, código, etiqueta, bitola, diâmetro).
          </CardInfo>
          <CardInfo emoji="📍" titulo="Metadados obrigatórios">
            App aplica data, hora e geolocalização automaticamente via watermark. Manter
            GPS ativo. Verificar que o watermark está visível.
          </CardInfo>
          <CardInfo emoji="🏷️" titulo="Legenda padrão">
            Mesma estrutura do texto de atividade: Disciplina — Serviço — Componente —
            Localização. Foto sem legenda é desconsiderada como evidência.
          </CardInfo>
          <CardInfo emoji="⚠️" titulo="Fotos de ocorrência">
            Em dano, defeito, acidente ou pedido do cliente, fotografar ANTES de
            qualquer intervenção. O "antes" é a prova mais importante.
          </CardInfo>
          <CardInfo emoji="✅" titulo="Upload e verificação">
            Sempre verificar que não há ícone de imagem quebrada. Fotos não carregadas
            são ausência de evidência. Reenviar imediatamente se necessário.
          </CardInfo>
          <CardInfo emoji="🌧️" titulo="Condições adversas">
            Em chuva ou paralisação, fotografar local com acúmulo de água, lona
            protetora ou condição que comprove a inviabilidade — data e hora visíveis.
          </CardInfo>
        </div>
      </Secao>

      <Secao id="prazos" titulo="09 — Prazos Críticos" sub="Janelas de tempo e consequências">
        <div className="prazos-grid">
          <Prazo dia="D+0" texto="Criação e lançamento. Até 17h30 do mesmo dia." />
          <Prazo dia="D+1" texto="Aprovação 1 — Supervisor da Obra. Última correção interna." />
          <Prazo dia="D+2" texto="Aprovação 2 — Gerente do Contrato. Liberação para o cliente." />
          <Prazo dia="D+7" texto="Prazo limite para aprovação do cliente. Cobrar formalmente." crit />
          <Prazo dia="D+15" texto="Escalar para Gerência de Contratos. Risco de glose na medição." crit />
          <Prazo dia="D+30" texto="Notificar formalmente. Medição em risco. Acionar jurídico se contratual." crit />
        </div>

        <Nota tipo="warn" titulo="Política de cobrança de aprovação do cliente">
          RDOs sem aprovação do cliente após D+7 devem ser cobrados por e-mail formal
          com assunto padrão: <em>"Pendência de aprovação — RDO nº [XXX] — [Nome da Obra]
          — [Data]"</em>, com cópia para o Gerente do Contrato Sistenge. Guardar o e-mail
          de cobrança como evidência de diligência.
        </Nota>
      </Secao>

      <Secao id="checklist" titulo="10 — Checklist Diário" sub="Antes de fechar o RDO do dia">
        <p>
          Use este checklist como rotina de encerramento antes de submeter o RDO para
          aprovação.
        </p>
        <ul className="checklist">
          <li>Numeração sequencial — sem lacunas na sequência.</li>
          <li>Data e dia da semana corretos — corresponde ao dia de execução, não de preenchimento.</li>
          <li>Condição climática preenchida — manhã e tarde com tempo e praticabilidade.</li>
          <li>Efetivo completo e correto — separando MOD, MOI e Terceiros.</li>
          <li>Todas as atividades descritas — cada frente com disciplina, ação, componente, localização e status.</li>
          <li>Fotos carregadas e sem erro — sem ícone de imagem quebrada.</li>
          <li>Legendas em todas as fotos — padrão Sistenge.</li>
          <li>Ocorrências registradas — todo evento fora do planejado.</li>
          <li>Solicitações do cliente formalizadas — com cargo do solicitante e horário.</li>
          <li>Horário de trabalho registrado — início, intervalo e término.</li>
          <li>Equipamentos registrados — com status de operação; parados com motivo.</li>
          <li>Quantitativos inseridos — metros, pontos, unidades.</li>
          <li>Submetido para aprovação — enviado ao Supervisor (Aprovador 1) até 17h30.</li>
        </ul>
      </Secao>

      <Secao id="riscos" titulo="11 — Riscos & Penalidades" sub="Consequências do RDO falho">
        <p>
          A ausência ou o preenchimento incorreto do RDO expõe a Sistenge a riscos
          simultâneos em múltiplas frentes.
        </p>

        <div className="card-grid card-grid-tight">
          <CardInfo emoji="⚖️" titulo="Trabalhista">
            Sem RDO, autuações do MTE sobre jornada, vínculo de terceiros e contribuições
            previdenciárias ficam sem defesa. Risco de inversão do ônus da prova.
          </CardInfo>
          <CardInfo emoji="📋" titulo="Contratual">
            Glose de medições, retenção de pagamentos, indeferimento de pleitos. Lei
            14.133/2021: multa por RDO não entregue ou incompleto.
          </CardInfo>
          <CardInfo emoji="🏛️" titulo="CREA / CAU">
            Ausência de RDO pode caracterizar negligência do RT vinculado à ART. Penas:
            advertência a suspensão profissional.
          </CardInfo>
          <CardInfo emoji="🔍" titulo="Pericial / Sinistro">
            Em acidentes ou perícias, o RDO é o documento mais consultado. Ausência ou
            inconsistência pode caracterizar culpa por omissão. Seguradoras podem
            recusar cobertura.
          </CardInfo>
        </div>

        <Nota tipo="info" titulo="Guarda documental">
          RDOs aprovados devem ser mantidos por <strong>no mínimo 5 anos</strong> após o
          encerramento do contrato, alinhado aos prazos prescricionais cíveis
          (CC art. 206) e trabalhistas (CLT art. 11). O diariodeobras.net mantém
          histórico em nuvem; é recomendada cópia em servidor local Sistenge.
        </Nota>
      </Secao>

      <Secao id="treinamento-rdo" titulo="12 — Treinamento" sub="Capacitação no sistema">
        <p>
          O sistema diariodeobras.net disponibiliza treinamentos em vídeo para todos os
          perfis. É obrigatório que todos os responsáveis operacionais e aprovadores
          concluam os módulos antes de operar o sistema.
        </p>

        <div className="video-cards">
          <VideoCard duracao="1min 49s" titulo="Apresentação geral do App Diário de Obra" />
          <VideoCard duracao="6min 20s" titulo="Demonstração online — versão web" />
          <VideoCard duracao="37min 04s" titulo="Treinamento completo — todas as funcionalidades" />
        </div>

        <p className="treinamento-cta">
          <a
            href="https://diariodeobras.net/treinamento/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-treinamento"
          >
            Acessar Central de Treinamento ↗
          </a>
        </p>

        <Nota tipo="info" titulo="Política de capacitação Sistenge">
          Todos os profissionais que utilizarão o sistema (Resp. Operacional, Aprovadores
          1 e 2) devem assistir ao <strong>treinamento completo (37min)</strong> antes do
          primeiro acesso. O Aprovador 3 (Cliente) deve receber orientação da equipe
          Sistenge sobre o fluxo de aprovação antes do início do contrato.
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

function CardInfo({ emoji, titulo, children }) {
  return (
    <div className="card-info">
      <div className="card-emoji">{emoji}</div>
      <h4>{titulo}</h4>
      <p>{children}</p>
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

function PassoFluxo({ n, titulo, prazo, children }) {
  return (
    <div className="passo-fluxo">
      <div className="passo-n">{n}</div>
      <div>
        <h4>{titulo}</h4>
        <p>{children}</p>
        <span className="passo-prazo">{prazo}</span>
      </div>
    </div>
  );
}

function Campo({ nivel, titulo, children }) {
  return (
    <div className={`campo-sistema campo-${nivel}`}>
      <div className="campo-head">
        <Tag tipo={nivel === 'obrigatorio' ? 'danger' : 'warn'}>
          {nivel === 'obrigatorio' ? 'Obrigatório' : 'Recomendado'}
        </Tag>
        <h4>{titulo}</h4>
      </div>
      <div className="campo-body">{children}</div>
    </div>
  );
}

function Exemplo({ children }) {
  return <p className="exemplo-inline"><strong>Ex.:</strong> {children}</p>;
}

function Ocorrencia({ emoji, titulo, tag, children }) {
  return (
    <div className="ocorrencia-card">
      <div className="ocorrencia-head">
        <span className="ocorrencia-emoji">{emoji}</span>
        <h4>{titulo}</h4>
        <Tag tipo="info">{tag}</Tag>
      </div>
      <div className="ocorrencia-body">{children}</div>
    </div>
  );
}

function Modelo({ children }) {
  return (
    <div className="modelo-texto">
      <span className="modelo-label">Texto modelo para o campo Ocorrências</span>
      <p>{children}</p>
    </div>
  );
}

function Prazo({ dia, texto, crit }) {
  return (
    <div className={`prazo-item ${crit ? 'prazo-crit' : ''}`}>
      <span className="prazo-dia">{dia}</span>
      <span className="prazo-txt">{texto}</span>
    </div>
  );
}

function VideoCard({ duracao, titulo }) {
  return (
    <div className="video-card">
      <span className="video-duracao">{duracao}</span>
      <span className="video-titulo">{titulo}</span>
    </div>
  );
}
