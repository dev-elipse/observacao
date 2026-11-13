<div align="center">

  <h2><strong>ObservAção</strong></h2>
  <p><strong>Sistema para registro e acompanhamento de ocorrências urbanas</strong></p>

</div>

---

## 🎯 Problema

Nem sempre é fácil para o cidadão comunicar um problema encontrado na cidade e saber o que acontece depois que ele é informado. Muitas vezes, porém, o cidadão não sabe onde registrar essas situações ou como acompanhar o andamento da solicitação. A falta de um processo simples para registrar e acompanhar essas ocorrências dificulta a organização e a resolução das demandas.

## 🌍 ODS

O projeto está relacionado ao ODS 11 — Cidades e Comunidades Sustentáveis, por tratar da organização e acompanhamento de demandas relacionadas aos espaços urbanos.

## ✨ Funcionalidades

* Cadastro de ocorrências urbanas, com ou sem identificação do cidadão
* Cadastro e login de cidadãos
* Classificação por categoria e prioridade
* Registro do endereço da ocorrência
* Acompanhamento do status e histórico das mudanças de status
* Consulta de ocorrências pelo protocolo (`id`) ou pelo título
* Painel do atendente, para atualizar o status das ocorrências
* Painel do gestor, com visão geral e CRUD completo das ocorrências
* API REST para ocorrências e cidadãos

## 🧩 Estrutura dos dados

O banco possui duas coleções, relacionadas entre si.

**`ocorrencias`**

Cada ocorrência possui informações como:

* Título
* Descrição
* Categoria
* Endereço (rua, número e bairro)
* Prioridade
* Status
* Datas
* `cidadaoId` — referência opcional ao cidadão que registrou a ocorrência
* `historicoStatus` — lista de subdocumentos com o status e a data de cada mudança de status

As categorias disponíveis são: `INFRAESTRUTURA`, `ILUMINACAO`, `LIMPEZA`, `SINALIZACAO`, `CALCADA`, `ARBORIZACAO` e `OUTROS`.
As prioridades são: `BAIXA`, `MEDIA` e `ALTA`.

**`cidadaos`**

Cada cidadão possui informações como:

* Nome
* CPF
* Telefone
* E-mail (único)
* Senha (armazenada como hash)
* `enderecos` — lista de subdocumentos com rua, número, bairro, cidade e estado

Exemplo de documento da coleção `cidadaos`:

```json
{
  "_id": "aep-cidadao-exemplo",
  "nome": "Ana Exemplo",
  "email": "ana.exemplo@example.com",
  "enderecos": [
    { "rua": "Rua das Flores", "numero": "120", "bairro": "Centro", "cidade": "Maringa", "estado": "PR" },
    { "rua": "Avenida Central", "numero": "45", "bairro": "Jardim America", "cidade": "Maringa", "estado": "PR" }
  ]
}
```

Exemplo de documento da coleção `ocorrencias`, ligado ao cidadão acima por `cidadaoId`:

```json
{
  "titulo": "Lâmpada queimada na praça",
  "descricao": "Poste de iluminação apagado há uma semana.",
  "categoria": "ILUMINACAO",
  "endereco": { "rua": "Avenida Central", "numero": "45", "bairro": "Jardim América" },
  "prioridade": "MEDIA",
  "status": "EM_ANALISE",
  "cidadaoId": "aep-cidadao-exemplo",
  "historicoStatus": [
    { "status": "EM_ANALISE", "data": "2026-11-10T12:00:00Z" }
  ]
}
```

Os dois documentos são criados automaticamente pelo `mongo-init.js`, junto com as validações de cada coleção (`$jsonSchema`) e o índice único de e-mail.

## 🔁 Fluxo da ocorrência

`ABERTA → EM_ANALISE → EM_ATENDIMENTO → RESOLVIDA`

## 🔎 Como funciona

**Cadastro e login.** O cidadão pode criar uma conta informando nome, CPF (11 dígitos), e-mail, telefone (10 ou 11 dígitos) e senha (mínimo de 8 caracteres). Depois do cadastro, ele entra com e-mail e senha. A senha é guardada como hash e o login mantém uma sessão por cookie. O cadastro é opcional: é possível registrar ocorrências sem se identificar.

**Registro de ocorrências.** O cidadão registra uma ocorrência informando título, descrição, categoria, endereço (rua, número e bairro) e prioridade. Se estiver logado, pode marcar a opção de identificar a ocorrência com o próprio nome; nesse caso, a ocorrência passa a guardar o `cidadaoId` dele. O sistema cria a ocorrência automaticamente com o status `ABERTA` e gera um identificador único (`id`), que funciona como protocolo de acompanhamento. Se um `cidadaoId` informado não existir, a API retorna erro 404.

**Fluxo de status e histórico.** A ocorrência é conduzida pelo fluxo de status `ABERTA → EM_ANALISE → EM_ATENDIMENTO → RESOLVIDA`. A mudança de status é feita através da atualização dos dados da ocorrência (mesma operação usada para editar título, descrição, categoria, endereço ou prioridade) — não existe uma rota separada só para status, a alteração é enviada junto com o restante dos dados da ocorrência. Sempre que o status realmente muda, o servidor acrescenta uma entrada (status e data) em `historicoStatus`, dentro da própria ocorrência. O cliente não envia o histórico.

**CRUD.** A aplicação permite realizar as operações de um CRUD sobre as ocorrências e sobre os cidadãos: inserir novos registros, consultar, atualizar e excluir diretamente no banco de dados. Qualquer registro pode ser consultado individualmente pelo seu identificador, listado junto com todos os demais, atualizado ou removido.

**Perfis na interface.**

* **Cidadão:** cria a conta, entra, registra ocorrências e consulta pelo protocolo ou título.
* **Atendente:** vê o resumo e a lista de ocorrências e altera o status.
* **Gestor:** vê o resumo, cria, edita e exclui ocorrências. Ao editar uma ocorrência identificada, vê os dados do solicitante.

## 🔌 API

Para `/api/ocorrencias` e `/api/cidadaos`:

| Método | Rota | Descrição | Resposta |
|---|---|---|---|
| `POST` | `/api/<recurso>` | Cria um registro | `201` |
| `GET` | `/api/<recurso>` | Lista os registros | `200` |
| `GET` | `/api/<recurso>/{id}` | Consulta um registro | `200` |
| `PUT` | `/api/<recurso>/{id}` | Atualiza um registro | `200` |
| `DELETE` | `/api/<recurso>/{id}` | Exclui um registro | `204` |

Para a conta do cidadão:

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/conta/cadastro` | Cria a conta |
| `POST` | `/api/conta/login` | Inicia a sessão |
| `GET` | `/api/conta` | Consulta a conta da sessão atual |
| `POST` | `/api/conta/logout` | Encerra a sessão |

Erros mais comuns: `400` (dados inválidos), `404` (registro não encontrado) e `409` (e-mail de cidadão já cadastrado). Um login com dados incorretos retorna `401`.

As rotas `/api/ocorrencias` e `/api/cidadaos` não exigem autenticação; a sessão é usada apenas pelas rotas `/api/conta`.

## 🏗️ Tecnologias

**Backend**

* Java 17 + Spring Boot 3
* Spring Data MongoDB
* Spring Validation

**Banco de dados**

* MongoDB 7 — coleções `cidadaos` e `ocorrencias`, validadas por `$jsonSchema` (`mongo-init.js`), com índice único de e-mail

**Frontend**

* React (Vite) + TypeScript
* Tailwind CSS

**Testes**

* JUnit 5 + Mockito (backend)
* JaCoCo (cobertura)
* `mongosh` (teste do script do banco)

**Containerização**

* Docker e Docker Compose (MongoDB, backend e frontend, cada um em seu próprio container)

## 🚀 Como executar

### Opção 1 — Com Docker (recomendado)

Pré-requisito: ter o Docker instalado e em execução.

```
git clone https://github.com/dev-elipse/observacao.git
cd observacao
docker compose up --build
```

Isso sobe os três serviços de uma vez, já conectados entre si:

* MongoDB: `localhost:27017` (banco, coleções, validações e dados de exemplo criados automaticamente via `mongo-init.js`)
* Backend: `http://localhost:8080`
* Frontend: `http://localhost:5173`

Para parar: `docker compose down`. Os dados do banco ficam guardados em um volume Docker e persistem entre reinicializações.

### Opção 2 — Sem Docker (manual)

Pré-requisitos: Java 17, Node.js 18+ e um MongoDB rodando localmente na porta 27017 (o Maven já vem embutido no projeto, através do `mvnw`; no Windows, use `mvnw.cmd`).

**1. Banco de dados**

Com o MongoDB local em execução, aplique os schemas e os dados iniciais a partir da raiz do projeto:

```
mongosh observacao mongo-init.js
```

O script pode ser executado novamente em um banco já existente, sem apagar os documentos.

**2. Backend**

```
cd server
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`, conectando no MongoDB local por padrão.

**3. Frontend** (em outro terminal)

```
cd client
npm install
npm run dev
```

A interface sobe em `http://localhost:5173` e já aponta para `http://localhost:8080` por padrão.

## 🧪 Testes e cobertura

**Testes do backend e cobertura (JaCoCo)**

```
cd server
./mvnw verify
```

Esse comando executa os testes automatizados, gera o relatório de cobertura em `server/target/site/jacoco/index.html` e falha se a cobertura de linhas ficar abaixo de **70%**, mínimo exigido pela AEP.

**Teste do script do banco**

Com o MongoDB em execução, a partir da raiz do projeto:

```
mongosh --quiet tests/mongo-init.test.js
```

Esse teste usa um banco temporário e não altera o banco `observacao`.
