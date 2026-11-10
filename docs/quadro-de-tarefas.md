# Quadro de tarefas - ObservAcao

Atualizado em 10/11/2026. Repositorio: [Filipinfp/observacao](https://github.com/Filipinfp/observacao).

**Responsabilidade compartilhada pela equipe**, sem divisao fixa por etapa e sem atribuicao individual obrigatoria. Manter Assignees vazio no GitHub; registrar a autoria real nos commits e revisoes.

**Quadro remoto: criacao e verificacao pendentes.** A [area Projects](https://github.com/Filipinfp/observacao/projects) e um ponto de acesso, nao a URL de um quadro criado. Nenhuma issue remota foi criada por esta preparacao.

## Regras de acompanhamento

- Colunas: Backlog, Em andamento, Revisao e Concluido.
- Backlog: planejado e ainda nao iniciado. Em andamento: execucao iniciada. Revisao: resultado pronto para conferencia. Concluido: criterios verificados com evidencias.
- Cada identificador T01-T12 corresponde a uma issue a criar ou vincular. Procurar uma issue equivalente antes de criar para evitar duplicacao.
- Registrar na issue objetivo, criterios de aceite, resultado e links de commits/PRs. Substituir os titulos abaixo pelos links quando existirem numeros reais.
- Atualizar o Project e este documento ao mudar o estado de uma tarefa. Nao inventar numeros de issues, revisoes, datas ou resultados.

## Backlog

### T08 - Organizar arquivos locais e regras de versionamento

Aceite: criar `.gitignore` na raiz; retirar `client/.env.local` do indice sem apagar a copia local; conferir que nenhum arquivo necessario foi removido. Ainda nao executado.

### T09 - Revisar e publicar a versao aprovada

Aceite: revisao de outro integrante registrada; integracao da branch conforme o fluxo combinado; tags/releases nos commits corretos; acesso ao repositorio confirmado. Nao publicar versao antes de confirmar a revisao.

### T10 - Gravar e publicar demonstracao

Aceite: video de 3 a 5 minutos seguindo o [roteiro](roteiro-demonstracao.md), com funcionamento, arquitetura, tecnologias, testes e resultados; link acessivel registrado na ficha. Gravacao pendente.

### T11 - Preencher identificacao e conferir links

Aceite: [ficha do projeto](ficha-projeto.md) preenchida com dados reais dos participantes, versao, repositorio, quadro e video; links conferidos. Nao presumir dados pessoais ou URLs.

## Em andamento

### T07 - Configurar quadro remoto e vincular tarefas

Resultado local: Kanban, tarefas, criterios de aceite e responsabilidade compartilhada preparados neste documento.

Aceite pendente: criar ou reutilizar um GitHub Project de `Filipinfp/observacao`; configurar as quatro colunas; criar/vincular as 12 issues, sem atribuicao individual; posicionar os itens conforme evidencias; registrar a URL real no README e neste arquivo. Acesso autenticado ao GitHub ainda necessario.

## Revisao

### T06 - Conferir documentacao e instrucoes de execucao

Resultado: documentacao tecnica, contrato da API, historico de alteracoes, roteiro, ficha e README registrados no commit `129a1b3`.

Aceite: outro integrante conferir contratos, exemplos, modelagem e links; reproduzir as instrucoes em sua instalacao; registrar aprovacao ou correcoes. A criacao dos arquivos nao comprova revisao.

### T12 - Validar o fluxo completo da aplicacao

Aceite: subir a versao final com Docker Compose; criar cidadao, registrar ocorrencia vinculada, mudar status e consultar historico; confirmar que repetir o status nao duplica o historico; conferir as telas existentes. Registrar data real, participante, commit, ambiente e resultado no roteiro. Testes automatizados nao substituem a conferencia manual.

## Concluido

Estes itens foram concluidos localmente antes da criacao do quadro. Ao cadastrar no GitHub, indicar que sao registros retrospectivos e manter a data real de criacao da issue. Nao simular historico de movimentacoes.

### T01 - Implementar cadastro de cidadaos

Aceite atendido: CRUD `/api/cidadaos`, DTOs, mapper, service e repositorio; enderecos completos; validacoes e tratamento de e-mail duplicado. Evidencias: commit `58596bf` e testes de cidadaos.

### T02 - Vincular ocorrencias a cidadaos

Aceite atendido: `cidadaoId` opcional, 404 para identificador inexistente, compatibilidade com clientes antigos e preservacao do vinculo quando omitido. Evidencias: commit `e853343` e testes de ocorrencias.

### T03 - Registrar historico de status

Aceite atendido: status e data registrados apenas quando ha mudanca no update; preservacao dos registros anteriores; retorno nas consultas existentes e compatibilidade com documentos antigos. Evidencia: commit `a9407c0` e testes.

### T04 - Atualizar schemas e exemplos MongoDB

Aceite atendido: validators, indice unico de e-mail, exemplos relacionados e reaplicacao sem apagar documentos. Evidencias: commit `a65f9ec`; `tests/mongo-init.test.js` aprovado em banco temporario em 10/11/2026.

### T05 - Validar testes e cobertura do backend

Aceite atendido: testes de controller, service e mapper sem Mockito; JaCoCo com minimo de 70% de linhas; comandos e escopo documentados. Evidencias: commits `a65f9ec` e `3fe1ef7`; em 10/11/2026, **44 testes aprovados e 223/227 linhas cobertas (98,24%)**. Percentual exclusivo do backend Java.

## Configuracao prevista no GitHub

Nome: **ObservAcao - Desenvolvimento**. Vincular a `Filipinfp/observacao`. Visualizacao Board agrupada por Status.

1. Conferir projetos e issues existentes antes de criar registros.
2. Configurar Status com Backlog, Em andamento, Revisao e Concluido.
3. Criar/vincular uma issue por tarefa, usando os titulos e criterios acima. Manter Assignees vazio.
4. Para T01-T05, incluir evidencias retrospectivas, fechar como concluidas e posicionar em Concluido.
5. Manter T06 e T12 em Revisao, T07 em Em andamento e T08-T11 em Backlog.
6. Conferir os 12 itens. Ao terminar a configuracao, mover T07 para Concluido e inserir a URL real do quadro nos documentos.
7. Conferir acesso dos integrantes e das pessoas que precisam avaliar o projeto. Nao alterar permissoes ou visibilidade sem combinar com o proprietario.

Essa configuracao descreve o resultado pretendido; nao declara que as acoes remotas ja aconteceram.
