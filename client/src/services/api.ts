/**
 * Cliente HTTP para a API REST do ObservAção.
 * Coleção única "ocorrencias" (1ª Entrega da AEP) — sem autenticação.
 */

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8080";
const API_PREFIX = `${API_BASE_URL}/api`;

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_PREFIX}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Erro ${response.status} (${response.statusText})${errorText ? `: ${errorText}` : ""}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }
  return undefined as T;
}

// ─── tipos ────────────────────────────────────────────────────────────────

export type CategoriaOcorrencia =
  | "INFRAESTRUTURA"
  | "ILUMINACAO"
  | "LIMPEZA"
  | "SINALIZACAO"
  | "CALCADA"
  | "ARBORIZACAO"
  | "OUTROS";

export type PrioridadeOcorrencia = "BAIXA" | "MEDIA" | "ALTA";

export type StatusOcorrencia =
  | "ABERTA"
  | "EM_ANALISE"
  | "EM_ATENDIMENTO"
  | "RESOLVIDA";

export interface EnderecoDTO {
  rua: string;
  numero: string;
  bairro: string;
}

export interface OcorrenciaCreateDTO {
  titulo: string;
  descricao: string;
  categoria: CategoriaOcorrencia;
  endereco: EnderecoDTO;
  prioridade?: PrioridadeOcorrencia;
  status?: StatusOcorrencia;
}

export interface OcorrenciaResponseDTO {
  id: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaOcorrencia;
  endereco: EnderecoDTO;
  prioridade: PrioridadeOcorrencia;
  status: StatusOcorrencia;
  createdAt: string;
  updatedAt: string;
}

// ─── serviço ──────────────────────────────────────────────────────────────

export const ocorrenciaService = {
  create: (data: OcorrenciaCreateDTO) =>
    apiCall<OcorrenciaResponseDTO>("/ocorrencias", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => apiCall<OcorrenciaResponseDTO[]>("/ocorrencias", { method: "GET" }),

  getById: (id: string) =>
    apiCall<OcorrenciaResponseDTO>(`/ocorrencias/${id}`, { method: "GET" }),

  update: (id: string, data: OcorrenciaCreateDTO) =>
    apiCall<OcorrenciaResponseDTO>(`/ocorrencias/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<void>(`/ocorrencias/${id}`, { method: "DELETE" }),
};
