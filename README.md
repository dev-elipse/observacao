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

Para atualizar um volume MongoDB existente, execute novamente `mongo-init.js`; o script aplica os validators com `collMod` e preserva os documentos. O Docker executa os scripts de inicializacao automaticamente apenas em volumes novos:

```bash
docker compose exec mongodb mongosh --quiet /docker-entrypoint-initdb.d/mongo-init.js
```

O script cria a colecao `cidadaos`, o indice unico `email` e exemplos com enderecos e ocorrencias vinculadas. `cidadaoId` e `historicoStatus` sao opcionais no schema para aceitar documentos antigos. A existencia do cidadao referenciado e validada pelo backend.


**Frontend** (em outro terminal)

```bash
cd client
npm install
npm run dev
```

Frontend em `http://localhost:5173`.

---

## 🧪 Testes e Cobertura

- JUnit 5 e MockMvc, com stubs de repositorio e sem Mockito.
- Cidadaos: CRUD, enderecos, validacoes e conflito de e-mail.
- Ocorrencias: vinculo opcional, cidadao inexistente, historico, documentos antigos e conversao de datas.
- **Escopo do JaCoCo: codigo Java do backend (`server/src/main/java`).** Frontend, `beta/` e scripts MongoDB nao entram nesse percentual.
- Minimo de **70% das linhas**, verificado na fase `verify`, sem alterar o limite ou as exclusoes.

Pre-requisitos: JDK 17 ou superior, acesso ao Maven Central na primeira execucao e MongoDB disponivel na URI configurada (o teste de contexto carrega a configuracao real do banco).

```bash
cd server
./mvnw clean verify
```

No PowerShell do Windows:

```powershell
cd server
.\mvnw.cmd clean verify
```

`./mvnw verify` tambem gera o relatorio e verifica o limite; `clean` remove resultados anteriores. O comando falha se houver testes com falha ou cobertura abaixo de 70%.

Relatorio: `server/target/site/jacoco/index.html`. Contadores reproduziveis: `server/target/site/jacoco/jacoco.xml`, elemento `counter` de tipo `LINE` no nivel do relatorio. Resultados dos testes: `server/target/surefire-reports/`.

**Medicao em 10/11/2026:** 42 testes, zero falhas, erros ou testes ignorados; **223 de 227 linhas cobertas (98,24%)**. `clean verify` concluido com `BUILD SUCCESS`, usando Maven 3.9.16 pelo Wrapper, JDK 21 e JaCoCo 0.8.12. Neste ambiente foram informados `MAVEN_USER_HOME` e `-Dmaven.repo.local` para usar o cache local do usuario; nao houve alteracao do escopo da medicao.

### Validacao do MongoDB

Na raiz do projeto, com MongoDB e `mongosh` disponiveis:

```bash
mongosh --quiet tests/mongo-init.test.js
```

Alternativa no PowerShell, usando o container do Compose e uma copia exata do script local:

```powershell
docker compose cp mongo-init.js mongodb:/tmp/observacao-a4-init.js
Get-Content -Raw -Encoding UTF8 tests/mongo-init.test.js | docker compose exec -T -e MONGO_INIT_SCRIPT=/tmp/observacao-a4-init.js mongodb mongosh --quiet --file /dev/stdin
```

Esse teste usa um banco temporario exclusivo e o remove ao terminar. Verifica schemas, subdocumentos, e-mail unico, exemplos relacionados, datas BSON, documentos antigos e reaplicacao sem duplicacao nem perda de dados. Executado com sucesso em 10/11/2026. E uma verificacao separada dos 42 testes Java e da cobertura JaCoCo.

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
