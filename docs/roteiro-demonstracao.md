# Roteiro de demonstração

Duração sugerida: 4 minutos, dentro do intervalo de 3 a 5 minutos. Distribuir os blocos entre os participantes antes da gravação. Utilizar dados fictícios.

## Preparação

- Iniciar o projeto com `docker compose up -d --build`, confirmar os serviços e aplicar o schema se o volume já existia.
- Abrir o frontend em `http://localhost:5173`, um cliente HTTP e a documentação técnica.
- Executar os testes e abrir o relatório JaCoCo. A imagem do backend é construída com testes ignorados; o build Docker não é evidência de aprovação dos testes.
- Anotar o commit demonstrado e evitar expor arquivos de configuração pessoal.

## 0:00–0:35 — Problema e solução

Apresentar o registro e acompanhamento de problemas urbanos, o público atendido e a relação com cidades sustentáveis e transparência. Mostrar brevemente as telas públicas existentes.

## 0:35–1:10 — Arquitetura e evolução

Mostrar React/TypeScript, API Java/Spring Boot e MongoDB. Explicar as duas coleções, a lista de endereços, o vínculo opcional e o histórico de status. Usar o diagrama da documentação técnica. Não afirmar que há login ou telas de cadastro de cidadãos.

## 1:10–2:40 — Fluxo funcional

1. Criar um cidadão pela API, com nome, e-mail de teste e um endereço completo; guardar o `id` retornado.
2. Criar uma ocorrência com esse `cidadaoId`, enviando todos os campos obrigatórios e status `ABERTA`; guardar o `id`.
3. Fazer PUT da ocorrência com o mesmo payload, alterando status para `EM_ANALISE`.
4. Consultar por GET e mostrar `cidadaoId` e `historicoStatus` com status e data.
5. Repetir o mesmo PUT e confirmar que não surge outra entrada no histórico.
6. Mostrar o registro/consulta e os painéis de ocorrências no frontend. O histórico e os cidadãos são demonstrados pela API.

Os payloads estão na [documentação técnica](DOCUMENTACAO_TECNICA.md). Excluir a ocorrência de teste antes do cidadão se for limpar os registros; não há cascata.

## 2:40–3:30 — Testes e qualidade

Mostrar o comando `./mvnw clean verify` ou `.\mvnw.cmd clean verify`, o resultado e o relatório JaCoCo. A última medição registrada é 44 testes e 98,24% de linhas do backend; se houver alterações, apresentar a medição nova. Explicar que frontend e scripts do banco estão fora desse percentual. Mostrar a execução separada de `tests/mongo-init.test.js` se houver tempo.

## 3:30–4:00 — Resultados e encerramento

Resumir o cadastro, relacionamento e rastreabilidade das mudanças. Mostrar o repositório, os documentos e o quadro real de tarefas. Informar as limitações atuais: acesso público, demonstração dos novos recursos pela API e ausência de cascata na exclusão de cidadãos.

## Registro da conferência manual

- Data e responsável: **preencher após executar**.
- Commit e ambiente: **preencher**.
- Fluxo da API: **pendente de conferência na instalação final**.
- Telas do frontend: **pendente de conferência na instalação final**.
- Resultado e problemas encontrados: **preencher com evidências reais**.
