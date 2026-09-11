export type Screen = "landing" | "cidadao" | "atendente" | "gestor";

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

export type StatusVariant = "blue" | "orange" | "green";

export interface Category {
  id: string;
  categoria: CategoriaOcorrencia;
  label: string;
  icon: string;
  iconColor: string;
  bgColor: string;
}

export interface Step {
  n: string;
  icon: string;
  title: string;
  desc: string;
}

export type FilterType = "todas" | "abertas" | "concluidas";
