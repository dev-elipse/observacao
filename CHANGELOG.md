# Histórico de alterações

As mudanças abaixo descrevem o código existente. Não indicam uma release publicada nem substituem a criação de tags nos commits aprovados.

## Não publicado

### Adicionado

- CRUD de cidadãos com endereços embutidos, validação de entrada e tratamento de e-mail duplicado (`58596bf`).
- Referência opcional `cidadaoId` em ocorrências, com validação de existência (`e853343`).
- Histórico de status com data, registrado nas atualizações que mudam o status (`a9407c0`).
- Schemas das coleções, índice único de e-mail, dados relacionados e teste de reaplicação do script MongoDB (`a65f9ec`).
- Testes de propagação de erros de persistência no serviço de cidadãos (`3fe1ef7`).
- Documentação técnica, contrato da API, quadro local, roteiro de demonstração e ficha do projeto.

### Corrigido

- Acesso à propriedade de destino da pasta de cache no Maven Wrapper para Windows (`a65f9ec`).

### Verificado

- Em 10/11/2026: 44 testes Java aprovados, cobertura de 223/227 linhas do backend (98,24%).
- Teste separado dos schemas, índice e reaplicação no MongoDB aprovado em banco temporário.

## Base funcional anterior

- CRUD público de ocorrências, com categoria, prioridade, endereço e status.
- Telas de cidadão, atendente e gestor em React.
- Persistência MongoDB e execução por Docker Compose (`0483ddc`).
- Testes JUnit e verificação de cobertura (`531e27a`).

Os identificadores são referências do histórico local consultado. A equipe deve confirmar a publicação desses commits e definir o versionamento antes de divulgar uma release.
