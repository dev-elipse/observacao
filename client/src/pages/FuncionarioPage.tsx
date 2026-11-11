import React, { useState, useEffect } from "react";
import { CATEGORIES } from "../constants";
import { ocorrenciaService } from "../services/api";
import type {
  OcorrenciaResponseDTO,
  StatusOcorrencia,
} from "../services/api";
import Badge from "../components/Badge";

interface FuncionarioPageProps {
  onBack: () => void;
}

type FuncionarioTab = "dashboard" | "ocorrencias";

const PRIORIDADE_COLOR: Record<string, string> = {
  BAIXA: "bg-slate-100 text-slate-600",
  MEDIA: "bg-blue-100 text-blue-700",
  ALTA: "bg-orange-100 text-orange-700",
};

const STATUS_LABEL: Record<string, string> = {
  ABERTA: "ABERTA",
  EM_ANALISE: "EM ANÁLISE",
  EM_ATENDIMENTO: "EM ATENDIMENTO",
  RESOLVIDA: "RESOLVIDA",
};

const STATUS_VARIANT: Record<string, "blue" | "orange" | "green"> = {
  ABERTA: "orange",
  EM_ANALISE: "blue",
  EM_ATENDIMENTO: "blue",
  RESOLVIDA: "green",
};

const STATUS_OPTIONS: { value: StatusOcorrencia; label: string }[] = [
  { value: "ABERTA", label: "Aberta" },
  { value: "EM_ANALISE", label: "Em Análise" },
  { value: "EM_ATENDIMENTO", label: "Em Atendimento" },
  { value: "RESOLVIDA", label: "Resolvida" },
];

const FuncionarioPage: React.FC<FuncionarioPageProps> = ({ onBack }) => {
  const [tab, setTab] = useState<FuncionarioTab>("dashboard");

  const [ocorrencias, setOcorrencias] = useState<OcorrenciaResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [novoStatus, setNovoStatus] = useState<StatusOcorrencia>("ABERTA");

  const [detalheModal, setDetalheModal] =
    useState<OcorrenciaResponseDTO | null>(null);

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [busca, setBusca] = useState("");

  const carregar = async () => {
    try {
      setLoading(true);
      setError("");
      const dados = await ocorrenciaService.getAll();
      setOcorrencias(dados || []);
    } catch {
      setError(
        "Não foi possível carregar os dados. Verifique se o backend está rodando.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const total = ocorrencias.length;
  const abertas = ocorrencias.filter((s) => s.status === "ABERTA").length;
  const emAtendimento = ocorrencias.filter(
    (s) => s.status === "EM_ATENDIMENTO",
  ).length;
  const resolvidas = ocorrencias.filter(
    (s) => s.status === "RESOLVIDA",
  ).length;
  const altaPrioridade = ocorrencias.filter(
    (s) => s.prioridade === "ALTA",
  ).length;

  const porCategoria = CATEGORIES.map((cat) => {
    const count = ocorrencias.filter((s) => s.categoria === cat.categoria).length;
    return {
      label: cat.label,
      count,
      icon: cat.icon,
      iconColor: cat.iconColor,
      bgColor: cat.bgColor,
    };
  })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const filtradas = ocorrencias.filter((s) => {
    const statusOk = filtroStatus === "todos" || s.status === filtroStatus;
    const catOk = filtroCategoria === "todas" || s.categoria === filtroCategoria;
    const buscaOk =
      !busca ||
      s.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      s.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      s.id.toLowerCase().includes(busca.toLowerCase());
    return statusOk && catOk && buscaOk;
  });

  const handleAlterarStatus = async () => {
    if (!statusModal.id) return;
    try {
      const ocorrenciaAtual = ocorrencias.find((s) => s.id === statusModal.id);
      if (!ocorrenciaAtual) throw new Error("Ocorrência não encontrada");

      await ocorrenciaService.update(statusModal.id, {
        titulo: ocorrenciaAtual.titulo,
        descricao: ocorrenciaAtual.descricao,
        categoria: ocorrenciaAtual.categoria,
        endereco: ocorrenciaAtual.endereco,
        prioridade: ocorrenciaAtual.prioridade,
        status: novoStatus,
      });

      await carregar();
      setStatusModal({ open: false, id: null });
      setDetalheModal(null);
    } catch (err) {
      console.error(err);
      alert(
        "Erro ao alterar status: " +
          (err instanceof Error ? err.message : "Erro desconhecido"),
      );
    }
  };

  const TABS: { id: FuncionarioTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
    { id: "ocorrencias", label: "Ocorrências", icon: "ti-file-text" },
  ];

  return (
    <div className="font-sans bg-slate-50 min-h-screen text-slate-800">
      {/* TOPNAV */}
      <nav className="bg-[#0F2A4A] flex items-center justify-between px-10 h-16 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <i className="ti ti-eye text-white text-sm" aria-hidden="true" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              Observ<span className="text-[#2E7BD4]">Ação</span>
            </span>
            <span className="ml-2 text-[10px] font-bold bg-emerald-400 text-[#0F2A4A] px-2 py-0.5 rounded-full tracking-wide">
              ATENDENTE
            </span>
          </div>

          <div className="flex items-center gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <i className={`ti ${t.icon} text-base`} aria-hidden="true" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors"
        >
          <i className="ti ti-arrow-left text-sm" aria-hidden="true" />
          Início
        </button>
      </nav>

      <main className="max-w-[1180px] mx-auto px-10 py-9">
        {loading && ocorrencias.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <i className="ti ti-loader animate-spin text-2xl mb-2 block" />
            Carregando dados...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500">{error}</div>
        ) : (
          <>
            {tab === "dashboard" && (
              <div>
                <h1 className="text-2xl font-extrabold mb-6 text-[#0F2A4A]">
                  Painel do Atendente
                </h1>

                <div className="grid grid-cols-5 gap-4 mb-8">
                  {[
                    { label: "Total", val: total, icon: "ti-file-text", bg: "bg-blue-50", color: "text-blue-600" },
                    { label: "Abertas", val: abertas, icon: "ti-circle-dot", bg: "bg-orange-50", color: "text-orange-500" },
                    { label: "Em atendimento", val: emAtendimento, icon: "ti-clock-hour-4", bg: "bg-sky-50", color: "text-sky-500" },
                    { label: "Resolvidas", val: resolvidas, icon: "ti-circle-check", bg: "bg-emerald-50", color: "text-emerald-600" },
                    { label: "Alta prioridade", val: altaPrioridade, icon: "ti-flame", bg: "bg-red-50", color: "text-red-500" },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="bg-white border border-slate-100 rounded-2xl px-5 py-5"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs text-slate-400 font-semibold mb-2">
                            {c.label}
                          </div>
                          <div className="text-3xl font-extrabold text-[#0F2A4A]">
                            {c.val}
                          </div>
                        </div>
                        <div
                          className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}
                        >
                          <i
                            className={`ti ${c.icon} text-lg ${c.color}`}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6">
                  <h2 className="text-base font-bold mb-5 text-[#0F2A4A]">
                    Ocorrências por Categoria
                  </h2>
                  {porCategoria.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      Nenhuma ocorrência registrada ainda.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {porCategoria.map((c) => (
                        <div
                          key={c.label}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg ${c.bgColor} flex items-center justify-center shrink-0`}
                          >
                            <i
                              className={`ti ${c.icon} text-lg ${c.iconColor}`}
                              aria-hidden="true"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-700">
                              {c.label}
                            </div>
                            <div className="text-xs text-slate-400">
                              {c.count} ocorrência(s)
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "ocorrencias" && (
              <div>
                <h1 className="text-2xl font-extrabold mb-6 text-[#0F2A4A]">
                  Ocorrências
                </h1>

                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <input
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Buscar por título, descrição ou protocolo"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                    <div className="flex gap-2">
                      <select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
                      >
                        <option value="todos">Todos os status</option>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
                      >
                        <option value="todas">Todas as categorias</option>
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.categoria}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead className="bg-slate-50">
                        <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          <th className="px-6 py-4">Título</th>
                          <th className="px-6 py-4">Categoria</th>
                          <th className="px-6 py-4">Prioridade</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtradas.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-10 text-center text-slate-500"
                            >
                              Nenhuma ocorrência encontrada
                            </td>
                          </tr>
                        ) : (
                          filtradas.map((s) => (
                            <tr
                              key={s.id}
                              onClick={() => setDetalheModal(s)}
                              className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <td className="px-6 py-4 align-top">
                                <div className="text-sm font-semibold text-slate-700">
                                  {s.titulo}
                                </div>
                                <div className="text-xs text-slate-400 font-mono mt-0.5">
                                  {s.id}
                                </div>
                              </td>
                              <td className="px-6 py-4 align-top text-sm text-slate-600">
                                {s.categoria}
                              </td>
                              <td className="px-6 py-4 align-top">
                                <span
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                    PRIORIDADE_COLOR[s.prioridade] ??
                                    "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {s.prioridade}
                                </span>
                              </td>
                              <td className="px-6 py-4 align-top">
                                <Badge
                                  status={STATUS_LABEL[s.status] ?? s.status}
                                  variant={STATUS_VARIANT[s.status] ?? "blue"}
                                />
                              </td>
                              <td
                                className="px-6 py-4"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    setStatusModal({ open: true, id: s.id });
                                    setNovoStatus(s.status);
                                  }}
                                  className="flex items-center gap-1 text-xs font-semibold text-[#2E7BD4] hover:underline"
                                >
                                  <i
                                    className="ti ti-refresh text-sm"
                                    aria-hidden="true"
                                  />
                                  Alterar Status
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL: DETALHES DA OCORRÊNCIA */}
      {detalheModal &&
        (() => {
          const s = detalheModal;
          const displayDate = s.createdAt
            ? new Date(s.createdAt).toLocaleDateString("pt-BR")
            : "—";
          const displayAddress = s.endereco
            ? `${s.endereco.rua}, ${s.endereco.numero} - ${s.endereco.bairro}`
            : "—";

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setDetalheModal(null)}
            >
              <div
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-[#0F2A4A] px-7 py-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {s.titulo}
                    </h2>
                    <p className="text-xs text-white/60 mt-0.5 font-mono">
                      {s.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setDetalheModal(null)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <i className="ti ti-x text-lg" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-7 space-y-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      status={STATUS_LABEL[s.status] || s.status}
                      variant={STATUS_VARIANT[s.status] || "blue"}
                    />
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        PRIORIDADE_COLOR[s.prioridade] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s.prioridade}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
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

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => {
                        setStatusModal({ open: true, id: s.id });
                        setNovoStatus(s.status);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#2E7BD4] hover:bg-slate-50 transition-colors"
                    >
                      <i className="ti ti-refresh text-sm" aria-hidden="true" />
                      Alterar Status
                    </button>
                    <button
                      onClick={() => setDetalheModal(null)}
                      className="ml-auto px-5 py-2.5 rounded-2xl bg-[#0F2A4A] text-white text-sm font-semibold hover:bg-[#1A3D6B] transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* MODAL: ALTERAR STATUS */}
      {statusModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#0F2A4A] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Alterar Status</h2>
                <p className="text-sm text-white/60 mt-0.5 font-mono">
                  {statusModal.id}
                </p>
              </div>
              <button
                onClick={() => setStatusModal({ open: false, id: null })}
                className="text-white/70 hover:text-white"
              >
                <i className="ti ti-x text-lg" aria-hidden="true" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Selecione o novo status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setNovoStatus(opt.value)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        novoStatus === opt.value
                          ? "border-[#0F2A4A] bg-[#0F2A4A] text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStatusModal({ open: false, id: null })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAlterarStatus}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0F2A4A] text-white text-sm font-bold hover:bg-[#1A3D6B] transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuncionarioPage;
