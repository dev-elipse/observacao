<div align="center">
  <img src="client/public/observacao.svg" alt="ObservAção Logo" width="100">
  
  <h2><strong>ObservAção</strong></h2>
  <p><strong>Sistema de gestão de solicitações cidadãs</strong></p>

![GitHub repo size](https://img.shields.io/github/repo-size/dev-elipse/observacao?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/dev-elipse/observacao?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/dev-elipse/observacao?style=for-the-badge)
</div>

---

## 🎬 Demo

### Fluxo de Registro e Acompanhamento

![Upload Demo](./docs/observacao_demo.gif)

---

## 🎯 Por quê?

Em muitos municípios brasileiros, ainda não existem canais eficientes, acessíveis e transparentes para que cidadãos registrem demandas públicas e acompanhem sua resolução.  
Isso gera:

- Falta de transparência
- Dificuldade de acompanhamento
- Baixa eficiência no atendimento
- Desigualdade no acesso a serviços públicos  

O **ObservaAção** surge como uma solução GovTech para **conectar cidadãos e poder público**, por meio de um sistema estruturado de solicitações.

> Promovendo transparência, rastreabilidade e eficiência na gestão pública.

---

## ✨ Funcionalidades

- Cadastro de solicitações com categoria, descrição e localização
- Consulta por protocolo
- Acompanhamento completo com histórico e status
- Controle de SLA por prioridade
- Painel de atendentes com filtros e gestão de demandas
- Dashboard gerencial com indicadores
- Suporte a solicitações anônimas
- Histórico imutável com auditoria

---

## 🔎 Como Funciona

1. O cidadão registra uma solicitação (identificada ou anônima).
2. O sistema gera um protocolo único.
3. A solicitação entra na fila de atendimento.
4. Um atendente analisa e atualiza o status:
 - Aberto → Em Triagem → Em Execução → Resolvido → Encerrado
5. Todas as movimentações são registradas com comentários obrigatórios.
6. O cidadão acompanha tudo via protocolo.

---

## 🏗️ Arquitetura

**Beta (CLI)**
- Java puro (POO)

**Frontend**
- React (Vite)
- TailwindCSS

**Backend**
- Java
- Spring Boot

**Banco de Dados**
- PostgreSQL (produção)
- H2 (testes)

---

## 🧩 Módulos do Sistema

| Módulo | Rotas | Descrição |
O sistema é dividido em três módulos principais, baseados nos perfis de usuário:

### 👤 Cidadão (Acesso Público)

Responsável pelo registro e acompanhamento de solicitações.

**Funcionalidades:**
- Cadastro de solicitações
- Consulta por protocolo
- Visualização de status e histórico
- Envio opcional de anexos
- Registro anônimo ou identificado

**Rotas principais:**
- `GET /`
- `GET /solicitar`
- `POST /solicitar`
- `GET /acompanhar`
- `GET /acompanhar/{protocolo}`
- `GET /categorias`

---

### 🧑‍💼 Atendente (Servidor Público)

Responsável pelo tratamento das demandas registradas.

**Funcionalidades:**
- Visualização de solicitações
- Filtragem por prioridade, categoria e localização
- Atualização de status
- Registro de comentários obrigatórios
- Justificativa de atrasos (SLA)

**Rotas principais:**
- `GET /painel`
- `GET /painel/solicitacoes/{id}`
- `PUT /painel/solicitacoes/{id}/status`
- `POST /painel/solicitacoes/{id}/comentario`

---

### 🧑‍💻 Gestor (Administrativo)

Responsável pela supervisão e gestão do sistema.

**Funcionalidades:**
- Dashboard com indicadores (SLA, status, categorias)
- Reatribuição de solicitações
- Alteração de prioridade
- Gestão de usuários
- Gestão de categorias
- Auditoria de ações

**Rotas principais:**
- `GET /gestor/dashboard`
- `PUT /gestor/solicitacoes/{id}/prioridade`
- `PUT /gestor/solicitacoes/{id}/reatribuir`
- `GET /gestor/usuarios`
- `POST /gestor/usuarios`
- `GET /gestor/logs`

---

### 🔐 Autenticação

**Rotas:**
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/senha/recuperar`
- `POST /auth/senha/redefinir`

---

---

## 🚀 Instalando o ObservAção

Para instalar o `ObservAção`, siga os seguintes passos:

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/dev-elipse/observacao
cd observacao
```

### 2️⃣ Backend Setup

```bash
cd server
./mvnw spring-boot:run
```
ou
```bash
cd server
./gradlew bootRun
```
Backend will run at:
```bash
http://localhost:8080
```

### 3️⃣ Frontend Setup

Open a new terminal
```bash
cd client
npm install
npm run dev
```
Frontend will run at:
```bash
http://localhost:5173
```

---

## 🧪 Testes
- Testes unitários (JUnit + Mockito)
- Testes de integração
- Cobertura mínima: 70%

```bash
./mvnw test
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
