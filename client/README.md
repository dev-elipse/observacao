# ObservAção — Portal do Cidadão

Plataforma GovTech para registro e acompanhamento de demandas públicas.

## Tecnologias

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- Tabler Icons (webfont)
- DM Sans (Google Fonts)

## Estrutura do Projeto

```
src/
├── components/
│   ├── Badge.tsx          # Componente de status badge
│   ├── LandingPage.tsx    # Página inicial pública
│   └── Dashboard.tsx      # Painel do cidadão autenticado
├── constants/
│   └── index.ts           # Dados mock, categorias, steps
├── types/
│   └── index.ts           # Interfaces e tipos TypeScript
├── App.tsx                # Componente raiz com navegação entre telas
├── main.tsx               # Entry point
└── index.css              # Diretivas @tailwind
```

## Como rodar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

### Build de produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## Telas

### Landing Page (pública)
- Navbar sticky com links e botões de acesso
- Hero com headline, métricas e cards de ação
- Grade de categorias de atendimento (7 tipos)
- Seção "Como Funciona" com 3 passos
- Rodapé institucional

### Dashboard (cidadão autenticado)
- Topnav com abas e menu de perfil com dropdown
- Saudação personalizada com busca por protocolo
- Cards de estatísticas (Total, Em execução, Abertos, Concluídos)
- Lista de solicitações com filtros por status
- Sidebar com nova solicitação e feed de atividade recente
