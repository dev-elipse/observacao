<div align="center">

  <h2><strong>ObservAção</strong></h2>
  <p><strong>Sistema para registro e acompanhamento de ocorrências urbanas</strong></p>

</div>

---

## 🎯 Problema

Nem sempre é fácil para o cidadão comunicar um problema encontrado na cidade e saber o que acontece depois que ele é informado. Muitas vezes, porém, o cidadão não sabe onde registrar essas situações ou como acompanhar o andamento da solicitação. A falta de um processo simples para registrar e acompanhar essas ocorrências dificulta a organização e a resolução das demandas.

## 🌍 ODS

O projeto está relacionado ao **ODS 11 — Cidades e Comunidades Sustentáveis**, por tratar da organização e acompanhamento de demandas relacionadas aos espaços urbanos.

---

## ✨ Funcionalidades

- Cadastro de ocorrências urbanas
- Classificação por categoria e prioridade
- Registro do endereço da ocorrência
- Acompanhamento do status
- Organização das ocorrências para análise e atendimento

## 🧩 Estrutura dos dados

Cada ocorrência possui informações como:

- Título
- Descrição
- Categoria
- Endereço
- Prioridade
- Status

As categorias disponíveis são:`INFRAESTRUTURA`, `ILUMINACAO`, `LIMPEZA`, `SINALIZACAO`, `CALCADA`, `ARBORIZACAO` e `OUTROS`. 

As prioridades são:`BAIXA`, `MEDIA` e `ALTA`.

## 🔁 Fluxo da ocorrência

`ABERTA → EM_ANALISE → EM_ATENDIMENTO → RESOLVIDA`

## 🔎 Como funciona

O cidadão registra uma ocorrência informando título, descrição, categoria, endereço (rua, número e bairro) e prioridade. O sistema cria a ocorrência automaticamente com o status `ABERTA` e gera um identificador único (`id`), que funciona como protocolo de acompanhamento.

A partir daí, a ocorrência é conduzida pelo fluxo de status `ABERTA → EM_ANALISE → EM_ATENDIMENTO → RESOLVIDA`. A mudança de status é feita através da atualização dos dados da ocorrência (mesma operação usada para editar título, descrição, categoria, endereço ou prioridade) — não existe uma rota separada só para status, a alteração é enviada junto com o restante dos dados da ocorrência.

Além do fluxo de acompanhamento, a aplicação permite realizar as operações básicas de um CRUD sobre as ocorrências: inserir novos registros, consultar, atualizar e excluir ocorrências diretamente no banco de dados. Qualquer ocorrência pode ser consultada individualmente pelo seu identificador, listada junto com todas as demais, atualizada ou removida.

---

## 🏗️ Tecnologias

**Backend**

- Java 17 + Spring Boot 3
- Spring Data MongoDB

**Banco de dados**

- MongoDB — coleção `ocorrencias`, validada por um `$jsonSchema` (`mongo-init.js`)

**Frontend**

- React (Vite) + TypeScript
- Tailwind CSS

**Containerização**

- Docker e Docker Compose (MongoDB, backend e frontend, cada um em seu próprio container)

---

## 🚀 Como executar

### Opção 1 — Com Docker (recomendado)

Pré-requisito: ter o Docker instalado e em execução.

```bash
git clone <url-do-repositorio>
cd observacao
docker compose up --build
```

Isso sobe os três serviços de uma vez, já conectados entre si:

- MongoDB: `localhost:27017` (banco e coleção criados automaticamente via `mongo-init.js`)
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

Para parar: `docker compose down`. Os dados do banco ficam guardados em um volume Docker e persistem entre reinicializações.

### Opção 2 — Sem Docker (manual)

Pré-requisitos: Java 17, Node.js 18+ e um MongoDB rodando localmente na porta 27017 (o Maven já vem embutido no projeto, através do `mvnw`).

**1. Banco de dados**

Com o MongoDB local em execução, aplique o schema e os dados iniciais a partir da raiz do projeto:

```bash
mongosh observacao mongo-init.js
```

**2. Backend**

```bash
cd server
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`, conectando no MongoDB local por padrão.

**3. Frontend** (em outro terminal)

```bash
cd client
npm install
npm run dev
```

A interface sobe em `http://localhost:5173` e já aponta para `http://localhost:8080` por padrão.
