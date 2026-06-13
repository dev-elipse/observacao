// API Base URL - pode ser configurado via variáveis de ambiente
const API_BASE_URL = "http://localhost:8080/api";

// Tipos genéricos para respostas
interface ApiResponse<T> {
  data: T;
  status: number;
}

// Função auxiliar para requisições
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Adicionar token se existir
  const token = localStorage.getItem("authToken");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.statusText} - ${error}`);
  }

  // Verificar se há conteúdo para parsear
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null as T;
}

// ============= USUÁRIOS =============

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  numeroTelefone?: string;
  cargo?: string;
  tipo: "CIDADAO" | "FUNCIONARIO_PUBLICO" | "GESTOR";
}

export const usuarioService = {
  // Criar novo usuário (cadastro)
  create: (data: Omit<UsuarioDTO, "id">) =>
    apiCall<UsuarioDTO>("/usuarios", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Obter todos os usuários
  getAll: () =>
    apiCall<UsuarioDTO[]>("/usuarios", {
      method: "GET",
    }),

  // Obter usuário por ID
  getById: (id: number) =>
    apiCall<UsuarioDTO>(`/usuarios/${id}`, {
      method: "GET",
    }),

  // Atualizar usuário
  update: (id: number, data: Partial<UsuarioDTO>) =>
    apiCall<UsuarioDTO>(`/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Deletar usuário
  delete: (id: number) =>
    apiCall<void>(`/usuarios/${id}`, {
      method: "DELETE",
    }),
};

// ============= SOLICITAÇÕES =============

export type CategoriaSolicitacao =
  | "INFRAESTRUTURA_URBANA"
  | "LIMPEZA_URBANA"
  | "MEIO_AMBIENTE"
  | "ILUMINACAO_PUBLICA"
  | "TRANSITO_MOBILIDADE"
  | "SAUDE_PUBLICA"
  | "LIMPEZA_URBANA"
  | "EDUCACAO"
  | "SEGURANCA_PUBLICA"
  | "OBRAS_PUBLICAS"
  | "SANEAMENTO"
  | "SERVICOS_PUBLICOS"
  | "OUTROS";

export type PrioridadeSolicitacao = "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";

export type StatusSolicitacao =
  | "ABERTO"
  | "EM_TRIAGEM"
  | "EM_EXECUCAO"
  | "AGUARDANDO_COMPLEMENTACAO"
  | "CONCLUIDO"
  | "CANCELADO"
  | "REJEITADO";

export interface SolicitacaoCreateDTO {
  categoria: CategoriaSolicitacao;
  descricao: string;
  prioridade?: PrioridadeSolicitacao;
  anonima?: boolean;
  usuarioId?: number;
  endereco?: string;
  telefone?: string;
}

export interface SolicitacaoResponseDTO {
  id: number;
  categoria: CategoriaSolicitacao;
  descricao: string;
  prioridade: PrioridadeSolicitacao;
  status: StatusSolicitacao;
  anonima: boolean;
  usuarioId?: number;
  dataAbertura: string;
  dataUltimaAtualizacao?: string;
  observacoes?: string;
  endereco?: string;
  telefone?: string;
  protocoloNumero?: string;
}

export const solicitacaoService = {
  // Criar nova solicitação
  create: (data: SolicitacaoCreateDTO) =>
    apiCall<SolicitacaoResponseDTO>("/solicitacoes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Obter todas as solicitações
  getAll: () =>
    apiCall<SolicitacaoResponseDTO[]>("/solicitacoes", {
      method: "GET",
    }),

  // Obter solicitação por ID
  getById: (id: number) =>
    apiCall<SolicitacaoResponseDTO>(`/solicitacoes/${id}`, {
      method: "GET",
    }),

  // Atualizar solicitação
  update: (id: number, data: Partial<SolicitacaoResponseDTO>) =>
    apiCall<SolicitacaoResponseDTO>(`/solicitacoes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Deletar solicitação
  delete: (id: number) =>
    apiCall<void>(`/solicitacoes/${id}`, {
      method: "DELETE",
    }),
};

// ============= AUTENTICAÇÃO =============

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  usuario: UsuarioDTO;
  token: string;
}

export const authService = {
  // Login
  login: (email: string, senha: string) =>
    apiCall<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    }),

  // Registro
  register: (data: Omit<UsuarioDTO, "id"> & { senha: string }) =>
    apiCall<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Logout
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuario");
  },

  // Verificar se usuário está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },

  // Obter usuário atual
  getCurrentUser: () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
  },

  // Salvar autenticação
  saveAuth: (usuario: UsuarioDTO, token: string) => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("authToken", token);
  },
};

// ============= ENDEREÇOS =============

export interface EnderecoDTO {
  id: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export const enderecoService = {
  create: (data: Omit<EnderecoDTO, "id">) =>
    apiCall<EnderecoDTO>("/enderecos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () =>
    apiCall<EnderecoDTO[]>("/enderecos", {
      method: "GET",
    }),

  getById: (id: number) =>
    apiCall<EnderecoDTO>(`/enderecos/${id}`, {
      method: "GET",
    }),

  update: (id: number, data: Partial<EnderecoDTO>) =>
    apiCall<EnderecoDTO>(`/enderecos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiCall<void>(`/enderecos/${id}`, {
      method: "DELETE",
    }),
};

// ============= ANEXOS =============

export interface AnexoDTO {
  id: number;
  nome: string;
  url: string;
  tipo: string;
  solicitacaoId: number;
}

export const anexoService = {
  create: (data: Omit<AnexoDTO, "id">) =>
    apiCall<AnexoDTO>("/anexos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () =>
    apiCall<AnexoDTO[]>("/anexos", {
      method: "GET",
    }),

  getById: (id: number) =>
    apiCall<AnexoDTO>(`/anexos/${id}`, {
      method: "GET",
    }),

  delete: (id: number) =>
    apiCall<void>(`/anexos/${id}`, {
      method: "DELETE",
    }),
};
