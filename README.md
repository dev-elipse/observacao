<div align="center">

  <h2><strong>ObservAção</strong></h2>
  <p><strong>Sistema de gestão de ocorrências urbanas — PoC (1ª Entrega, AEP Engenharia de Software 2026.2)</strong></p>

![GitHub repo size](https://img.shields.io/github/repo-size/dev-elipse/observacao?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/dev-elipse/observacao?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/dev-elipse/observacao?style=for-the-badge)

</div>

---

## 🎯 Problema

Em muitos municípios brasileiros, ainda não existem canais eficientes, acessíveis e transparentes para que cidadãos relatem problemas urbanos (buracos, iluminação apagada, lixo acumulado, sinalização danificada etc.) e acompanhem sua resolução. Isso gera falta de transparência, dificuldade de acompanhamento e baixa eficiência no atendimento público.

O **ObservAção** é uma PoC (Proof of Concept) GovTech que conecta cidadãos e poder público através do registro público de ocorrências urbanas, com acompanhamento por protocolo.

## 🌍 ODS (Objetivos de Desenvolvimento Sustentável — ONU)

O projeto está alinhado principalmente ao:

- **ODS 11 — Cidades e Comunidades Sustentáveis**: contribui para a melhoria da gestão urbana e da qualidade de vida.
- **ODS 16 — Paz, Justiça e Instituições Eficazes**: promove transparência e rastreabilidade no atendimento público.
- **ODS 10 — Redução das Desigualdades**: garante acesso público e igualitário ao canal de registro, sem necessidade de cadastro.

---

## ⚠️ Escopo desta entrega

Este repositório está **intencionalmente simplificado** para atender apenas aos requisitos da **1ª Entrega** da AEP:

- ✅ Coleção NoSQL **única** (`ocorrencias`), com objetos homogêneos e estrutura simples.
- ✅ Operações básicas de **CRUD** completo.
- ✅ Sem autenticação — todas as telas são públicas.
- ❌ Múltiplas coleções relacionadas, documentos aninhados/listas de subdocumentos e demais evoluções da 2ª Entrega **ainda não foram implementadas** — ficam para a próxima etapa.

---

## ✨ Funcionalidades (1ª Entrega)

- Registro público de ocorrências (categoria, título, descrição, endereço e prioridade)
- Consulta pública por protocolo (ID) ou por título
- Painel do Atendente: listagem, filtros e atualização de status
- Painel do Gestor: dashboard com indicadores (por status, prioridade e categoria) e CRUD completo (criar, editar, excluir)
- Todas as telas acessíveis sem login

## 🔎 Como Funciona

1. O cidadão registra uma ocorrência (sem necessidade de cadastro).
2. O sistema gera um protocolo único (`id` do documento).
3. Um atendente acompanha a fila e atualiza o status: `ABERTA` → `EM_ANALISE` → `EM_ATENDIMENTO` → `RESOLVIDA`.
4. O gestor acompanha indicadores agregados e pode editar/excluir qualquer ocorrência.
5. O cidadão acompanha tudo publicamente via protocolo.

---

## 🏗️ Arquitetura

**Frontend**

- React (Vite) + TypeScript
- TailwindCSS

**Backend**

- Java 17 + Spring Boot 3
- Spring Data MongoDB

**Banco de Dados**

- MongoDB — coleção única `ocorrencias`, com `$jsonSchema` de validação (`mongo-init.js`)

**Testes**

- JUnit 5 + MockMvc
- JaCoCo (relatório e verificação automática de cobertura ≥ 70%)

> A pasta `beta/` contém um protótipo standalone em Java puro (POO, sem framework) usado como exploração inicial do domínio. Não faz parte da PoC avaliada nesta entrega.

---

## 🧩 Estrutura da coleção `ocorrencias`

```json
{
  "titulo": "Buraco na Rua das Flores",
  "descricao": "Buraco grande próximo ao número 120, risco para veículos.",
  "categoria": "INFRAESTRUTURA",
  "endereco": { "rua": "Rua das Flores", "numero": "120", "bairro": "Centro" },
  "prioridade": "ALTA",
  "status": "ABERTA"
}
```

- `categoria`: `INFRAESTRUTURA` · `ILUMINACAO` · `LIMPEZA` · `SINALIZACAO` · `CALCADA` · `ARBORIZACAO` · `OUTROS`
- `prioridade`: `BAIXA` · `MEDIA` · `ALTA`
- `status`: `ABERTA` · `EM_ANALISE` · `EM_ATENDIMENTO` · `RESOLVIDA`

O schema é validado diretamente pelo MongoDB (`validationLevel: strict`) através do `mongo-init.js`.

## 🧩 Telas do sistema (SPA — sem rotas de navegador, troca de tela por estado)

Todas as telas são **públicas** (sem autenticação):

- **Cidadão** — registrar e consultar ocorrências
- **Atendente** — listar, filtrar e atualizar status
- **Gestor** — dashboard de indicadores + CRUD completo

## 🔌 API REST

| Método   | Rota                    | Descrição                    |
| -------- | ----------------------- | ---------------------------- |
| `POST`   | `/api/ocorrencias`      | Cria uma ocorrência          |
| `GET`    | `/api/ocorrencias`      | Lista todas as ocorrências   |
| `GET`    | `/api/ocorrencias/{id}` | Busca uma ocorrência pelo id |
| `PUT`    | `/api/ocorrencias/{id}` | Atualiza uma ocorrência      |
| `DELETE` | `/api/ocorrencias/{id}` | Remove uma ocorrência        |

---

## 🚀 Instalando o ObservAção

### Opção 1 — Docker Compose (recomendado)

```bash
git clone https://github.com/dev-elipse/observacao
cd observacao
docker compose up --build
```

- MongoDB: `localhost:27017` (seed automático via `mongo-init.js`)
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

### Opção 2 — Manual

**Backend**

```bash
cd server
./mvnw spring-boot:run
```

Backend em `http://localhost:8080`. Requer um MongoDB local em `mongodb://localhost:27017/observacao` (rode `mongosh observacao mongo-init.js` a partir da raiz do projeto para aplicar o schema e o seed).

**Frontend** (em outro terminal)

```bash
cd client
npm install
npm run dev
```

Frontend em `http://localhost:5173`.

---

## 🧪 Testes e Cobertura

- Testes unitários com JUnit 5 para o mapper e o service
- Testes de integração da camada web (MockMvc) para o controller
- Cobertura mínima obrigatória: **70%**, verificada automaticamente pelo JaCoCo

```bash
cd server
./mvnw clean verify
```

O comando falha caso a cobertura fique abaixo de 70%. O relatório em HTML fica disponível em:

```
server/target/site/jacoco/index.html
```

---

## 🤝 Contribuição

Contribuições são bem-vindas!

1. Fork esse repositório.
2. Crie uma branch:

```bash
git checkout -b feature/your-feature-name
```

3. Commit suas alterações:

```bash
git commit -m "feat: add your feature"
```

4. Faça um Push para a sua branch:

```bash
git push origin feature/your-feature-name
```

5. Abra um pull request.

Alternativamente, consulte a documentação do GitHub em: [how to create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## 📄 Licença

Este projeto é open-source e está disponível sob a licença MIT.
