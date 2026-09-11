import React, { useState, useEffect, useCallback } from "react";
import { CATEGORIES } from "../constants";
import { ocorrenciaService } from "../services/api";
import type {
  OcorrenciaResponseDTO,
  CategoriaOcorrencia,
  PrioridadeOcorrencia,
} from "../services/api";
import type { FilterType } from "../types";
import Badge from "../components/Badge";

interface DashboardProps {
  onBack: () => void;
  protocoloInicial?: string;
}

// Mapa de categoria do backend → ícone do frontend
const CATEGORY_ICON_MAP: Record<string, string> = {
  INFRAESTRUTURA: "ti-alert-triangle",
  ILUMINACAO: "ti-bulb",
  LIMPEZA: "ti-trash",
  SINALIZACAO: "ti-traffic-cone",
  CALCADA: "ti-road",
  ARBORIZACAO: "ti-trees",
  OUTROS: "ti-grid-dots",
};

const STATUS_LABEL: Record<string, string> = {
  ABERTA: "ABERTA",
  EM_ANALISE: "EM ANÁLISE",
  EM_ATENDIMENTO: "EM ATENDIMENTO",
  RESOLVIDA: "RESOLVIDA",
};

const PRIORIDADE_COLOR: Record<string, string> = {
  BAIXA: "bg-slate-100 text-slate-600",
  MEDIA: "bg-blue-100 text-blue-700",
  ALTA: "bg-orange-100 text-orange-700",
};

const Dashboard: React.FC<DashboardProps> = ({ onBack, protocoloInicial }) => {
  const [filter, setFilter] = useState<FilterType>("todas");
  const [busca, setBusca] = useState(protocoloInicial ?? "");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [requestRua, setRequestRua] = useState("");
  const [requestNumero, setRequestNumero] = useState("");
  const [requestBairro, setRequestBairro] = useState("");
  const [requestPriority, setRequestPriority] =
    useState<PrioridadeOcorrencia>("MEDIA");
  const [requestTitulo, setRequestTitulo] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<OcorrenciaResponseDTO | null>(null);

  const carregarOcorrencias = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const dados = await ocorrenciaService.getAll();
      setOcorrencias(dados || []);
    } catch (err: unknown) {
      setError(
        "Não foi possível carregar as ocorrências. Verifique se o backend está rodando.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarOcorrencias();
  }, [carregarOcorrencias]);

  const filtered = ocorrencias.filter((r) => {
    const statusOk =
      filter === "todas"
        ? true
        : filter === "concluidas"
          ? r.status === "RESOLVIDA"
          : r.status !== "RESOLVIDA";
    const buscaOk =
      !busca ||
      r.id.toLowerCase().includes(busca.toLowerCase()) ||
      r.titulo.toLowerCase().includes(busca.toLowerCase());
    return statusOk && buscaOk;
  });

  const selectedCategoryLabel =
    CATEGORIES.find((cat) => cat.id === selectedCategory)?.label ||
    "Selecione uma categoria";

  const resetForm = () => {
    setShowRequestModal(false);
    setSelectedCategory("");
    setRequestRua("");
    setRequestNumero("");
    setRequestBairro("");
    setRequestPriority("MEDIA");
    setRequestTitulo("");
    setRequestDescription("");
    setError("");
  };

  const formValid =
    !!selectedCategory &&
    requestTitulo.trim().length > 0 &&
    requestRua.trim().length > 0 &&
    requestNumero.trim().length > 0 &&
    requestBairro.trim().length > 0 &&
    requestDescription.trim().length > 0;

  const handleRequestSubmit = async () => {
    const categoria = CATEGORIES.find(
      (cat) => cat.id === selectedCategory,
    )?.categoria as CategoriaOcorrencia | undefined;

    if (!categoria || !formValid) return;

    try {
      setLoading(true);
      setError("");

      await ocorrenciaService.create({
        titulo: requestTitulo,
        descricao: requestDescription,
        categoria,
        endereco: {
          rua: requestRua,
          numero: requestNumero,
          bairro: requestBairro,
        },
        prioridade: requestPriority,
        status: "ABERTA",
      });

      await carregarOcorrencias();
      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError("Erro ao registrar ocorrência: " + message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total de ocorrências",
      val: ocorrencias.length.toString(),
      icon: "ti-file-text",
      iconClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    {
      label: "Em atendimento",
      val: ocorrencias
        .filter((s) => s.status === "EM_ATENDIMENTO")
        .length.toString(),
      icon: "ti-clock-hour-4",
      iconClass: "text-sky-500",
      bgClass: "bg-sky-50",
    },
    {
      label: "Em aberto",
      val: ocorrencias.filter((s) => s.status === "ABERTA").length.toString(),
      icon: "ti-circle-dot",
      iconClass: "text-orange-500",
      bgClass: "bg-orange-50",
    },
    {
      label: "Resolvidas",
      val: ocorrencias
        .filter((s) => s.status === "RESOLVIDA")
        .length.toString(),
      icon: "ti-circle-check",
      iconClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
  ];

  const filterOptions: [FilterType, string][] = [
    ["todas", "Todas"],
    ["abertas", "Em andamento"],
    ["concluidas", "Resolvidas"],
  ];

  return (
    <div className="font-sans bg-slate-50 min-h-screen text-slate-800">
      {/* TOPNAV */}
      <nav className="bg-white border-b border-slate-100 flex items-center justify-between px-10 h-16 sticky top-0 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0F2A4A] flex items-center justify-center">
            <i className="ti ti-eye text-white text-sm" aria-hidden="true" />
          </div>
          <span className="font-bold text-base text-[#0F2A4A] tracking-tight">
            Observ<span className="text-[#2E7BD4]">Ação</span>
          </span>
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <i className="ti ti-arrow-left text-sm" aria-hidden="true" />
          Início
        </button>
      </nav>

      <main className="max-w-[1180px] mx-auto px-10 py-9">
        {/* GREETING */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold mb-1.5 text-[#0F2A4A]">
              Ocorrências da Cidade
            </h1>
            <p className="text-slate-400 text-sm">
              Registre um novo problema ou acompanhe uma ocorrência pelo
              protocolo (ID).
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
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div>
                  <h2 className="text-base font-bold mb-1 text-[#0F2A4A]">
                    Ocorrências Registradas
                  </h2>
                  <p className="text-xs text-slate-400">
                    Acompanhe o status de qualquer ocorrência pública
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
              <div className="relative">
                <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por protocolo (ID) ou título"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="px-6 py-10 text-center text-slate-500">
                  <i className="ti ti-loader animate-spin text-2xl mb-2 block" />
                  Carregando ocorrências...
                </div>
              ) : error ? (
                <div className="px-6 py-10 text-center text-red-500">
                  <p>{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-6 py-10 text-center text-slate-500">
                  <p>Nenhuma ocorrência encontrada</p>
                </div>
              ) : (
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      <th className="px-6 py-4">Categoria</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Prioridade</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Protocolo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showAll ? filtered : filtered.slice(0, 5)).map((req) => {
                      const categoryIcon =
                        CATEGORY_ICON_MAP[req.categoria] ?? "ti-file-text";
                      const displayDate = req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString("pt-BR")
                        : "—";

                      return (
                        <tr
                          key={req.id}
                          onClick={() => setSelectedRequest(req)}
                          className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 align-top">
                            <div className="flex items-center gap-2">
                              <i
                                className={`ti ${categoryIcon} text-base text-slate-400`}
                                aria-hidden="true"
                              />
                              <span className="text-sm font-semibold text-slate-700">
                                {req.titulo}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top text-sm text-slate-500">
                            {displayDate}
                          </td>
                          <td className="px-6 py-4 align-top">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                PRIORIDADE_COLOR[req.prioridade] ??
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {req.prioridade}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <Badge
                              status={STATUS_LABEL[req.status] ?? req.status}
                              variant={
                                req.status === "ABERTA"
                                  ? "orange"
                                  : req.status === "RESOLVIDA"
                                    ? "green"
                                    : "blue"
                              }
                            />
                          </td>
                          <td className="px-6 py-4 align-top text-xs text-slate-400 font-mono">
                            {req.id}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {!loading && !error && filtered.length > 5 && (
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
                    : `Ver todas as ocorrências (${filtered.length})`}
                  <i className="ti ti-arrow-right text-xs" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="flex flex-col gap-5">
            <div className="bg-[#0F2A4A] rounded-2xl p-6 text-white">
              <h3 className="text-sm font-bold mb-2">Nova Ocorrência</h3>
              <p className="text-xs text-white/65 leading-relaxed mb-5">
                Clique no botão abaixo para abrir o formulário e escolher a
                categoria dentro do popup.
              </p>
              <button
                type="button"
                onClick={() => setShowRequestModal(true)}
                className="w-full bg-amber-400 text-[#0F2A4A] rounded-xl py-2.5 text-xs font-bold hover:bg-amber-300 transition-colors"
              >
                + Nova ocorrência
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-[#0F2A4A] px-8 py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Nova Ocorrência
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
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Selecione a categoria
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
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
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Categoria selecionada
                      </label>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory("")}
                        className="text-xs font-semibold text-[#2E7BD4] hover:underline"
                      >
                        Trocar
                      </button>
                    </div>
                    <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 bg-slate-50">
                      {selectedCategoryLabel}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={requestTitulo}
                      onChange={(e) => setRequestTitulo(e.target.value)}
                      placeholder="Ex: Buraco na Rua das Flores"
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Rua
                      </label>
                      <input
                        type="text"
                        value={requestRua}
                        onChange={(e) => setRequestRua(e.target.value)}
                        placeholder="Ex: Rua das Flores"
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        value={requestNumero}
                        onChange={(e) => setRequestNumero(e.target.value)}
                        placeholder="120"
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={requestBairro}
                      onChange={(e) => setRequestBairro(e.target.value)}
                      placeholder="Ex: Centro"
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={requestPriority}
                      onChange={(e) =>
                        setRequestPriority(
                          e.target.value as PrioridadeOcorrencia,
                        )
                      }
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="BAIXA">Baixa</option>
                      <option value="MEDIA">Normal</option>
                      <option value="ALTA">Alta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Descrição do problema
                    </label>
                    <textarea
                      value={requestDescription}
                      onChange={(e) => setRequestDescription(e.target.value)}
                      placeholder="Descreva o problema e o impacto observado"
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
                      disabled={loading || !formValid}
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
                        "Registrar ocorrência"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedRequest &&
        (() => {
          const s = selectedRequest;
          const categoryIcon = CATEGORY_ICON_MAP[s.categoria] ?? "ti-file-text";
          const displayDate = s.createdAt
            ? new Date(s.createdAt).toLocaleDateString("pt-BR")
            : "—";
          const displayAddress = s.endereco
            ? `${s.endereco.rua}, ${s.endereco.numero} - ${s.endereco.bairro}`
            : "—";

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedRequest(null)}
            >
              <div
                className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
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
                          {s.titulo}
                        </h2>
                        <p className="text-xs text-white/60 mt-0.5 font-mono">
                          {s.id}
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

                <div className="p-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <Badge
                      status={STATUS_LABEL[s.status] ?? s.status}
                      variant={
                        s.status === "RESOLVIDA"
                          ? "green"
                          : s.status === "ABERTA"
                            ? "orange"
                            : "blue"
                      }
                    />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <i className="ti ti-calendar text-sm" aria-hidden="true" />
                      {displayDate}
                    </span>
                  </div>

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

                  <div className="border-t border-slate-100" />

                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Descrição
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                      {s.descricao}
                    </p>
                  </div>

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
