import React, { useState, useEffect, useRef, useCallback } from "react";
import { CATEGORIES, ACTIVITY_EVENTS } from "../constants";
import {
  solicitacaoService,
  authService,
  SolicitacaoResponseDTO,
  CategoriaSolicitacao,
} from "../services/api";
import type { FilterType } from "../types";
import Badge from "../components/Badge";

interface DashboardProps {
  onLogout: () => void;
}

// Mapa de categoria do backend → ícone do frontend
const CATEGORY_ICON_MAP: Record<string, string> = {
  ILUMINACAO_PUBLICA: "ti-bulb",
  INFRAESTRUTURA_URBANA: "ti-alert-triangle",
  LIMPEZA_URBANA: "ti-trash",
  SAUDE_PUBLICA: "ti-heart-rate-monitor",
  SEGURANCA_PUBLICA: "ti-shield-check",
  MEIO_AMBIENTE: "ti-trees",
  TRANSITO_MOBILIDADE: "ti-car",
  EDUCACAO: "ti-school",
  OBRAS_PUBLICAS: "ti-building",
  SANEAMENTO: "ti-droplet",
  SERVICOS_PUBLICOS: "ti-briefcase",
  OUTROS: "ti-grid-dots",
};

// Mapa de categoria do frontend (id) → enum do backend
const CATEGORY_MAP: Record<string, CategoriaSolicitacao> = {
  iluminacao: "ILUMINACAO_PUBLICA",
  buraco: "INFRAESTRUTURA_URBANA",
  limpeza: "LIMPEZA_URBANA",
  saude: "SAUDE_PUBLICA",
  seguranca: "SEGURANCA_PUBLICA",
  poda: "MEIO_AMBIENTE",
  outros: "OUTROS",
};

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [filter, setFilter] = useState<FilterType>("todas");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAddress, setRequestAddress] = useState("");
  const [requestPriority, setRequestPriority] = useState("MEDIA");
  const [requestDescription, setRequestDescription] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoResponseDTO[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<SolicitacaoResponseDTO | null>(null);
  const [addressError, setAddressError] = useState("");

  // Ref para fechar o dropdown ao clicar fora
  const profileRef = useRef<HTMLDivElement>(null);

  // Lê o usuário UMA vez no mount — evita loop de re-render
  const usuario = React.useMemo(() => authService.getCurrentUser(), []);
  const userName = usuario?.nome || "Usuário";

  // Iniciais do nome para o avatar
  const userInitials = userName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  // Fecha o dropdown de perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const carregarSolicitacoes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const dados = await solicitacaoService.getAll();
      const lista = dados || [];

      // Cidadão só enxerga as próprias solicitações
      if (usuario?.tipo === "CIDADAO") {
        setSolicitacoes(lista.filter((s) => s.usuarioId === usuario.id));
      } else {
        setSolicitacoes(lista);
      }
    } catch (err: unknown) {
      setError("Erro ao carregar solicitações");
      console.error(err);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    carregarSolicitacoes();
  }, [carregarSolicitacoes]);

  const filtered = solicitacoes.filter((r) => {
  if (filter === "abertas")
    return r.status === "ABERTO" || r.status === "EM_EXECUCAO" || r.status === "EM_TRIAGEM";
  if (filter === "concluidas")
    return r.status === "CONCLUIDO";
    return true;
  });

  const selectedCategoryLabel =
    CATEGORIES.find((cat) => cat.id.toString() === selectedCategory)?.label ||
    "Selecione uma categoria";

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const resetForm = () => {
    setShowRequestModal(false);
    setSelectedCategory("");
    setRequestAddress("");
    setRequestPriority("MEDIA");
    setRequestDescription("");
    setError("");
    setAddressError("");
  };

  const handleRequestSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      await solicitacaoService.create({
        categoria: CATEGORY_MAP[selectedCategory] ?? "OUTROS",
        descricao: requestDescription,
        prioridade: requestPriority as "BAIXA" | "MEDIA" | "ALTA" | "URGENTE",
        usuarioId: usuario?.id ?? undefined,
        endereco: requestAddress,
        anonima: false,
      });

      await carregarSolicitacoes();
      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError("Erro ao criar solicitação: " + message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const stats = [
    {
      label: "Total de solicitações",
      val: solicitacoes.length.toString(),
      icon: "ti-file-text",
      iconClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    {
      label: "Em execução",
      val: solicitacoes
        .filter((s) => s.status === "EM_EXECUCAO")
        .length.toString(),
      icon: "ti-clock-hour-4",
      iconClass: "text-sky-500",
      bgClass: "bg-sky-50",
    },
    {
      label: "Em aberto",
      val: solicitacoes.filter((s) => s.status === "ABERTO").length.toString(),
      icon: "ti-circle-dot",
      iconClass: "text-orange-500",
      bgClass: "bg-orange-50",
    },
    {
      label: "Concluídas",
      val: solicitacoes
        .filter((s) => s.status === "CONCLUIDO")
        .length.toString(),
      icon: "ti-circle-check",
      iconClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
  ];

  const filterOptions: [FilterType, string][] = [
    ["todas", "Todas"],
    ["abertas", "Em andamento"],
    ["concluidas", "Concluídas"],
  ];

  const profileMenu: [string, string][] = [
    ["ti-user", "Meu Perfil"],
    ["ti-settings", "Configurações"],
    ["ti-shield", "Privacidade"],
  ];

const statusMap: Record<string, string> = {
  ABERTO: "ABERTO",
  TRIAGEM: "EM TRIAGEM",
  EM_EXECUCAO: "EM EXECUÇÃO",
  RESOLVIDO: "RESOLVIDO",
  ENCERRADO: "ENCERRADO",
};

  return (
    <div className="font-sans bg-slate-50 min-h-screen text-slate-800">
      {/* TOPNAV */}
      <nav className="bg-white border-b border-slate-100 flex items-center justify-between px-10 h-16 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F2A4A] flex items-center justify-center">
              <i className="ti ti-eye text-white text-sm" aria-hidden="true" />
            </div>
            <span className="font-bold text-base text-[#0F2A4A] tracking-tight">
              Observ<span className="text-[#2E7BD4]">Ação</span>
            </span>
          </div>
        </div>

        {/* PROFILE DROPDOWN — fecha ao clicar fora */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile((prev) => !prev)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="text-right">
              <div className="text-sm font-bold text-[#0F2A4A]">{userName}</div>
              <div className="text-[11px] text-slate-400">
                {usuario?.tipo === "GESTOR"
                  ? "Gestor"
                  : usuario?.tipo === "FUNCIONARIO_PUBLICO"
                    ? "Funcionário Público"
                    : "Cidadão verificado"}
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0F2A4A] flex items-center justify-center shrink-0">
              <span className="text-[13px] font-bold text-white">
                {userInitials}
              </span>
            </div>
            <i
              className="ti ti-chevron-down text-slate-400 text-sm"
              aria-hidden="true"
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-slate-100 rounded-xl p-2 w-52 shadow-lg z-50">
              <div className="px-3.5 py-3 border-b border-slate-100 mb-1">
                <div className="font-bold text-sm text-[#0F2A4A]">
                  {userName}
                </div>
                <div className="text-xs text-slate-400">
                  {usuario?.email || ""}
                </div>
              </div>
              <div className="mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors text-left font-[inherit]">
                  <i className="ti ti-logout text-base" aria-hidden="true" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-[1180px] mx-auto px-10 py-9">
        {/* GREETING */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold mb-1.5 text-[#0F2A4A]">
              Olá, {userName}
            </h1>
            <p className="text-slate-400 text-sm">
              Acompanhe suas solicitações ou registre um novo problema em sua
              região.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-9">
          {stats.map(({ label, val, icon, iconClass, bgClass }) => (
            <div
              key={label}
              className="bg-white border border-slate-100 rounded-2xl px-5 py-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-slate-400 font-semibold mb-2">
                    {label}
                  </div>
                  <div className="text-4xl font-extrabold text-[#0F2A4A]">
                    {val}
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center`}
                >
                  <i
                    className={`ti ${icon} text-xl ${iconClass}`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1.9fr_300px] gap-6">
          {/* REQUESTS LIST */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-base font-bold mb-1 text-[#0F2A4A]">
                  Minhas Solicitações
                </h2>
                <p className="text-xs text-slate-400">
                  Acompanhe o status das suas demandas
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      filter === id
                        ? "bg-[#0F2A4A] text-white"
                        : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="px-6 py-10 text-center text-slate-500">
                  <i className="ti ti-loader animate-spin text-2xl mb-2 block" />
                  Carregando solicitações...
                </div>
              ) : error ? (
                <div className="px-6 py-10 text-center text-red-500">
                  <p>{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-6 py-10 text-center text-slate-500">
                  <p>Nenhuma solicitação encontrada</p>
                </div>
              ) : (
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Prioridade</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Protocolo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAll ? filtered : filtered.slice(0, 5)).map((req) => {
                      // Ícone resolvido a partir do enum do backend
                      const categoryIcon =
                        CATEGORY_ICON_MAP[req.categoria] ?? "ti-file-text";

                      // Data: tenta createdAt (campo real do backend), depois dataAbertura
                      const rawDate =
                        (req as unknown as Record<string, string>).createdAt ??
                        req.dataAbertura;
                      const displayDate = rawDate
                        ? new Date(rawDate).toLocaleDateString("pt-BR")
                        : "—";

                      // Endereço: campo pode não vir do backend padrão
                      const displayAddress =
                        (req as unknown as Record<string, string>).endereco ??
                        "—";

                      return (
                        <tr
                          key={req.id}
                          className="border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => setSelectedRequest(req)}
                          title="Clique para ver a descrição"
                        >
                          <td className="px-6 py-4 align-top">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                <i
                                  className={`ti ${categoryIcon} text-xl text-slate-500`}
                                  aria-hidden="true"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-sm text-[#0F2A4A]">
                                  {req.categoria.replace(/_/g, " ")}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {displayAddress}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top text-sm text-slate-600">
                            {displayDate}
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                req.prioridade === "URGENTE"
                                  ? "bg-red-100 text-red-700"
                                  : req.prioridade === "ALTA"
                                    ? "bg-orange-100 text-orange-700"
                                    : req.prioridade === "MEDIA"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {req.prioridade}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <Badge
                              status={statusMap[req.status] ?? req.status}
                              variant={
                                req.status === "ABERTO" || req.status === "EM_TRIAGEM"
                                  ? "orange"
                                  : req.status === "CONCLUIDO"
                                  ? "green"
                                  : "blue"
                              }
                            />
                          </td>
                          <td className="px-6 py-4 align-top text-xs text-slate-400 font-mono">
                            {req.protocoloNumero ?? `PRF-${req.id}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-slate-100">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAll(!showAll);
                }}
                className="text-xs font-semibold text-[#2E7BD4] flex items-center gap-1 hover:underline"
              >
                {showAll
                  ? "Ver menos"
                  : `Ver todas as solicitações (${filtered.length})`}
                <i className="ti ti-arrow-right text-xs" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="flex flex-col gap-5">
            {/* Nova Solicitação */}
            <div className="bg-[#0F2A4A] rounded-2xl p-6 text-white">
              <h3 className="text-sm font-bold mb-2">Nova Solicitação</h3>
              <p className="text-xs text-white/65 leading-relaxed mb-5">
                Clique no botão abaixo para abrir o formulário e escolher a
                categoria dentro do popup.
              </p>
              <button
                type="button"
                onClick={() => setShowRequestModal(true)}
                className="w-full bg-amber-400 text-[#0F2A4A] rounded-xl py-2.5 text-xs font-bold hover:bg-amber-300 transition-colors"
              >
                + Nova solicitação
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-[#0F2A4A] px-8 py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Nova Solicitação
                  </h2>
                  <p className="text-sm text-slate-200 mt-1">
                    Categoria selecionada:{" "}
                    <span className="font-semibold">
                      {selectedCategoryLabel}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-white/80 hover:text-white"
                >
                  <i className="ti ti-x text-lg" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {!selectedCategory ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Selecione a categoria
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            handleCategorySelect(cat.id.toString())
                          }
                          className="rounded-2xl border border-slate-200 p-4 bg-slate-50 text-slate-700 hover:border-[#0F2A4A] hover:bg-slate-100 transition-colors"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl ${cat.bgColor} flex items-center justify-center mx-auto mb-2`}
                          >
                            <i
                              className={`ti ${cat.icon} text-xl ${cat.iconColor}`}
                              aria-hidden="true"
                            />
                          </div>
                          <div className="text-xs font-semibold text-center">
                            {cat.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">
                    Escolha a categoria para continuar com os detalhes da
                    solicitação.
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Categoria selecionada
                    </label>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 bg-slate-50">
                      {selectedCategoryLabel}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Endereço da ocorrência
                      </label>
                      <input
                        type="text"
                        value={requestAddress}
                        onChange={(e) => {
                          setRequestAddress(e.target.value);
                          if (e.target.value.trim().length < 10) {
                            setAddressError(
                              "Informe um endereço completo (mínimo 10 caracteres).",
                            );
                          } else if (!/\d/.test(e.target.value)) {
                            setAddressError(
                              "O endereço deve conter um número.",
                            );
                          } else {
                            setAddressError("");
                          }
                        }}
                        onBlur={() => {
                          if (!requestAddress.trim()) {
                            setAddressError("O endereço é obrigatório.");
                          }
                        }}
                        placeholder="Ex: Rua das Flores, 100 - Centro"
                        className={`w-full border rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none transition-colors ${
                          addressError
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-200 focus:border-blue-400"
                        }`}
                      />
                      {addressError && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <i
                            className="ti ti-alert-circle"
                            aria-hidden="true"
                          />
                          {addressError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={requestPriority}
                      onChange={(e) => setRequestPriority(e.target.value)}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="BAIXA">Baixa</option>
                      <option value="MEDIA">Normal</option>
                      <option value="ALTA">Alta</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Descrição do problema
                    </label>
                    <textarea
                      value={requestDescription}
                      onChange={(e) => setRequestDescription(e.target.value)}
                      placeholder="Descreva o problema, local exato e impacto"
                      rows={5}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestSubmit}
                      disabled={
                        loading ||
                        !selectedCategory ||
                        !requestAddress.trim() ||
                        !!addressError ||
                        !requestDescription.trim()
                      }
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#0F2A4A] text-white text-sm font-bold hover:bg-[#1A3D6B] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <i
                            className="ti ti-loader animate-spin"
                            aria-hidden="true"
                          />
                          Enviando...
                        </>
                      ) : (
                        "Abrir solicitação"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* DESCRIPTION POPUP MODAL */}
      {selectedRequest &&
        (() => {
          const categoryIcon =
            CATEGORY_ICON_MAP[selectedRequest.categoria] ?? "ti-file-text";
          const rawDate =
            (selectedRequest as unknown as Record<string, string>).createdAt ??
            selectedRequest.dataAbertura;
          const displayDate = rawDate
            ? new Date(rawDate).toLocaleDateString("pt-BR")
            : "—";
          const displayAddress =
            (selectedRequest as unknown as Record<string, string>).endereco ??
            "—";
          const statusLabel =
            {
              ABERTO: "ABERTO",
              EM_EXECUCAO: "EM EXECUÇÃO",
              CONCLUIDO: "CONCLUÍDO",
              EM_TRIAGEM: "EM TRIAGEM",
              AGUARDANDO_COMPLEMENTACAO: "AGUARDANDO",
              CANCELADO: "CANCELADO",
              REJEITADO: "REJEITADO",
            }[selectedRequest.status] ?? selectedRequest.status;

          const statusColor =
            selectedRequest.status === "CONCLUIDO"
              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : selectedRequest.status === "ABERTO"
                ? "text-orange-600 bg-orange-50 border-orange-200"
                : "text-sky-600 bg-sky-50 border-sky-200";

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedRequest(null)}
            >
              <div
                className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-[#0F2A4A] px-7 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <i
                          className={`ti ${categoryIcon} text-xl text-white`}
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">
                          {selectedRequest.categoria.replace(/_/g, " ")}
                        </h2>
                        <p className="text-xs text-white/60 mt-0.5">
                          {selectedRequest.protocoloNumero ??
                            `PRF-${selectedRequest.id}`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <i className="ti ti-x text-lg" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7 space-y-5">
                  {/* Status + Data */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <i
                        className="ti ti-calendar text-sm"
                        aria-hidden="true"
                      />
                      {displayDate}
                    </span>
                  </div>

                  {/* Local */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Local
                    </p>
                    <p className="text-sm text-slate-700 flex items-start gap-2">
                      <i
                        className="ti ti-map-pin text-base text-slate-400 mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      {displayAddress}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100" />

                  {/* Descrição */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Descrição da solicitação
                    </p>
                    {selectedRequest.descricao ? (
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                        {selectedRequest.descricao}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        Nenhuma descrição fornecida.
                      </p>
                    )}
                  </div>

                  {/* Footer button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="px-5 py-2.5 rounded-2xl bg-[#0F2A4A] text-white text-sm font-semibold hover:bg-[#1A3D6B] transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default Dashboard;