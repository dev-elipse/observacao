# Contrato de dados e API

Referência detalhada: [documentação técnica](DOCUMENTACAO_TECNICA.md).

## Recursos

- `cidadaos`: `id`, `nome`, `email`, `enderecos[]` com rua, número, bairro, cidade e estado. E-mail único, validado pela API e pelo índice do banco quanto à unicidade.
- `ocorrencias`: campos existentes de título, descrição, categoria, endereço, prioridade, status e datas; `cidadaoId` opcional; `historicoStatus[]` com status e data gerados pelo servidor.
- No MongoDB o identificador é `_id`; as respostas HTTP usam `id`. Datas do banco são BSON Date; na API, ISO 8601.

## Regras de compatibilidade

1. Registrar ocorrências continua possível sem cadastrar cidadão.
2. Um `cidadaoId` informado em criação ou atualização precisa existir; caso contrário, a API retorna 404.
3. Omitir ou enviar `null` em `cidadaoId` no PUT preserva o vínculo existente. Não há desvinculação implementada.
4. O histórico é acrescentado apenas quando o status muda no PUT, sem rota adicional e sem aceitar histórico fornecido pelo cliente.
5. Documentos antigos podem não ter os novos campos. A API retorna histórico vazio quando ausente.
6. PUT exige os campos obrigatórios. Prioridade/status omitidos recebem os padrões do DTO; valores explicitamente nulos preservam os anteriores na atualização.
7. A exclusão de cidadão não altera ocorrências; não há cascata nem bloqueio de referência.

## Rotas e respostas

Para `/api/cidadaos` e `/api/ocorrencias`: POST cria (201 e Location), GET lista (200), GET com `/{id}` consulta (200), PUT com `/{id}` atualiza (200), DELETE com `/{id}` exclui (204).

Validação inválida: 400. Recurso não encontrado: 404. E-mail duplicado de cidadão: 409. Os contratos completos e exemplos de payload estão na documentação técnica. Não há autenticação, paginação ou filtros de consulta na API.
