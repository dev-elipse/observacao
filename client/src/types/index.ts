export type Screen = "landing" | "login" | "signup" | "dashboard" | "gestor" | "funcionario";

export type RequestStatus = "ABERTO" | "EM EXECUÇÃO" | "CONCLUÍDO";

export type StatusVariant = "blue" | "orange" | "green";

export interface ServiceRequest {
  id: string;
  type: string;
  icon: string;
  addr: string;
  date: string;
  status: RequestStatus;
  variant: StatusVariant;
}

export interface Category {
  id: string;
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

export interface ActivityEvent {
  msg: string;
  time: string;
  icon: string;
  iconColor: string;
}

export type FilterType = "todas" | "abertas" | "concluidas";