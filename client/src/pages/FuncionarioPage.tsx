import React, { useState, useEffect } from "react";
import { CATEGORIES } from "../constants";
import { solicitacaoService, authService } from "../services/api";
import type { SolicitacaoResponseDTO, UsuarioDTO } from "../services/api";
import Badge from "../components/Badge";

interface FuncionarioPageProps {
  onLogout: () => void;
}

// ─── tipos auxiliares ────────────────────────────────────────────────────────

type FuncionarioTab = "dashboard" | "solicitacoes";

// ─── helpers ─────────────────────────────────────────────────────────────────

type Prioridade = "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";

const PRIORIDADE_COLOR: Record<Prioridade, string> = {
  BAIXA: "bg-slate-100 text-slate-600",
  MEDIA: "bg-blue-100 text-blue-700",
  ALTA: "bg-orange-100 text-orange-700",
  URGENTE: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  ABERTO: "ABERTO",
  EM_EXECUCAO: "EM EXECUÇÃO",
  TRIAGEM: "EM TRIAGEM",
  RESOLVIDO: "RESOLVIDO",
  ENCERRADO: "ENCERRADO",
};

const STATUS_VARIANT: Record<string, "blue" | "orange" | "green"> = {
  ABERTO: "orange",
  EM_EXECUCAO: "blue",
  TRIAGEM: "blue",
  RESOLVIDO: "green",
  ENCERRADO: "green",
};

// ─── componente principal ─────────────────────────────────────────────────────

const FuncionarioPage: React.FC<FuncionarioPageProps> = ({ onLogout }) => {
  const [tab, setTab] = useState<FuncionarioTab>("dashboard");
  const [showProfile, setShowProfile] = useState(false);

  // dados
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [statusModal, setStatusModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [novoStatus, setNovoStatus] = useState<string>("ABERTO");

  // modal detalhes da solicitação
  const [detalheModal, setDetalheModal] = useState<SolicitacaoResponseDTO | null>(null);

  // filtros solicitações
  const [solFiltroStatus, setSolFiltroStatus] = useState("todos");
  const [solFiltroCategoria, setSolFiltroCategoria] = useState("todas");
  const [solBusca, setSolBusca] = useState("");

  // usuário logado
  const usuario = authService.getCurrentUser();
  const userName = usuario?.nome || "Funcionário";
  const userInitials = userName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  // ── carregamento de dados ──────────────────────────────────────────────────

  const carregar = async () => {
    try {
      setLoading(true);
      setError("");
      const sols = await solicitacaoService.getAll();
      setSolicitacoes(sols || []);
    } catch {
      setError("Não foi possível carregar os dados. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  // ── métricas para o dashboard ──────────────────────────────────────────────

  const total = solicitacoes.length;
  const abertos = solicitacoes.filter((s) => s.status === "ABERTO").length;
  const emExecucao = solicitacoes.filter((s) => s.status === "EM_EXECUCAO").length;
  const concluidos = solicitacoes.filter((s) => s.status === "CONCLUIDO").length;
  const urgentes = solicitacoes.filter((s) => s.prioridade === "URGENTE").length;

  const porCategoria = CATEGORIES.map((cat) => {
    const key = cat.id.toUpperCase().replace(/-/g, "_");
    const count = solicitacoes.filter((s) => s.categoria.includes(key) || s.categoria === cat.id.toUpperCase()).length;
    return { label: cat.label, count, icon: cat.icon, iconColor: cat.iconColor, bgColor: cat.bgColor };
  }).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);


  // ── solicitações filtradas ─────────────────────────────────────────────────

  const solFiltradas = solicitacoes.filter((s) => {
    const statusOk = solFiltroStatus === "todos" || s.status === solFiltroStatus;
    const catOk = solFiltroCategoria === "todas" || s.categoria === solFiltroCategoria;
    const buscaOk = !solBusca || s.descricao.toLowerCase().includes(solBusca.toLowerCase()) || String(s.id).includes(solBusca);
    return statusOk && catOk && buscaOk;
  });


  const handleAlterarStatus = async () => {
  if (!statusModal.id) return;
  try {
    const solicitacaoAtual = solicitacoes.find((s) => s.id === statusModal.id);
    if (!solicitacaoAtual) throw new Error("Solicitação não encontrada");

    await solicitacaoService.update(statusModal.id, {
      categoria: solicitacaoAtual.categoria,
      descricao: solicitacaoAtual.descricao,
      prioridade: solicitacaoAtual.prioridade,
      status: novoStatus as any,
      anonima: solicitacaoAtual.anonima,
      usuarioId: solicitacaoAtual.usuarioId ?? undefined,
      endereco: (solicitacaoAtual as any).endereco ?? "",
    } as any);

    await carregar();
    setStatusModal({ open: false, id: null });
      } catch (err) {
        console.error(err);
        alert("Erro ao alterar status: " + (err instanceof Error ? err.message : "Erro desconhecido"));
      }
    };

  // ── navegação ──────────────────────────────────────────────────────────────

  const TABS: { id: FuncionarioTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
    { id: "solicitacoes", label: "Solicitações", icon: "ti-file-text" },
  ];

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="font-sans bg-slate-50 min-h-screen text-slate-800">

      {/* ── TOPNAV ───────────────────────────────────────────────────────────── */}
      <nav className="bg-[#0F2A4A] flex items-center justify-between px-10 h-16 sticky top-0 z-50">
        {/* logo + abas */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <i className="ti ti-eye text-white text-sm" aria-hidden="true" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              Observ<span className="text-[#2E7BD4]">Ação</span>
            </span>
            <span className="ml-2 text-[10px] font-bold bg-emerald-400 text-[#0F2A4A] px-2 py-0.5 rounded-full tracking-wide">
              FUNCIONÁRIO
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

        {/* perfil */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="text-right">
              <div className="text-sm font-bold text-white">{userName}</div>
              <div className="text-[11px] text-white/50">Funcionário Público</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center shrink-0">
              <span className="text-[13px] font-bold text-[#0F2A4A]">{userInitials}</span>
            </div>
            <i className="ti ti-chevron-down text-white/60 text-sm" aria-hidden="true" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-slate-100 rounded-xl p-2 w-48 shadow-lg z-50">
              <div className="px-3.5 py-3 border-b border-slate-100 mb-1">
                <div className="font-bold text-sm text-[#0F2A4A]">{userName}</div>
                <div className="text-xs text-slate-400">{usuario?.email || ""}</div>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors text-left"
                >
                  <i className="ti ti-logout text-base" aria-hidden="true" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── CORPO ────────────────────────────────────────────────────────────── */}
      <main className="max-w-[1280px] mx-auto px-10 py-8">

        {/* erro global */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <i className="ti ti-alert-circle text-red-500 text-xl" aria-hidden="true" />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={carregar} className="ml-auto text-xs font-semibold text-red-700 underline">
              Tentar novamente
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <i className="ti ti-loader animate-spin text-3xl text-[#0F2A4A]" aria-hidden="true" />
            <span className="ml-3 text-slate-500">Carregando dados...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* ╔══════════════════════════════════════════╗
                ║  ABA: DASHBOARD                          ║
                ╚══════════════════════════════════════════╝ */}
            {tab === "dashboard" && (
              <div className="space-y-8">
                {/* título */}
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0F2A4A]">Painel de Acompanhamento</h1>
                  <p className="text-slate-400 text-sm mt-1">
                    Olá, {userName}. Acompanhe as demandas em andamento e os indicadores gerais.
                  </p>
                </div>

                {/* cards de métricas */}
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { label: "Total", val: total, icon: "ti-file-text", ic: "text-slate-500", bg: "bg-slate-50" },
                    { label: "Abertos", val: abertos, icon: "ti-circle-dot", ic: "text-orange-500", bg: "bg-orange-50" },
                    { label: "Em execução", val: emExecucao, icon: "ti-clock-hour-4", ic: "text-sky-500", bg: "bg-sky-50" },
                    { label: "Concluídos", val: concluidos, icon: "ti-circle-check", ic: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Urgentes", val: urgentes, icon: "ti-flame", ic: "text-red-500", bg: "bg-red-50" },
                  ].map(({ label, val, icon, ic, bg }) => (
                    <div key={label} className="bg-white border border-slate-100 rounded-2xl px-5 py-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs text-slate-400 font-semibold mb-2">{label}</div>
                          <div className="text-4xl font-extrabold text-[#0F2A4A]">{val}</div>
                        </div>
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                          <i className={`ti ${icon} text-xl ${ic}`} aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-[1fr_340px] gap-6">
                  {/* tabela de solicitações recentes */}
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100">
                      <h2 className="text-base font-bold text-[#0F2A4A]">Solicitações Recentes</h2>
                      <p className="text-xs text-slate-400 mt-1">Clique em uma linha para ver detalhes ou alterar o status.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left">
                        <thead className="bg-slate-50">
                          <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                            <th className="px-6 py-4">Categoria</th>
                            <th className="px-6 py-4">Prioridade</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {solicitacoes.slice(0, 5).map((s) => (
                            <tr
                              key={s.id}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                              onClick={() => setDetalheModal(s)}
                            >
                              <td className="px-6 py-4">
                                <div className="font-semibold text-sm text-[#0F2A4A]">{s.categoria.replace(/_/g, " ")}</div>
                                <div className="text-xs text-slate-400 truncate max-w-[200px]">{s.descricao}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${PRIORIDADE_COLOR[s.prioridade as Prioridade] || "bg-slate-100 text-slate-600"}`}>
                                  {s.prioridade}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <Badge status={STATUS_LABEL[s.status] || s.status} variant={STATUS_VARIANT[s.status] || "blue"} />
                              </td>
                              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => { setStatusModal({ open: true, id: s.id }); setNovoStatus(s.status); }}
                                  className="flex items-center gap-1 text-xs font-semibold text-[#2E7BD4] hover:underline"
                                >
                                  <i className="ti ti-refresh text-sm" aria-hidden="true" />
                                  Status
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* distribuição por categoria */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-[#0F2A4A] mb-1">Por Categoria</h2>
                    <p className="text-xs text-slate-400 mb-5">Top categorias com mais demandas abertas.</p>
                    {porCategoria.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-8">Nenhum dado disponível.</p>
                    ) : (
                      <div className="space-y-3">
                        {porCategoria.slice(0, 6).map((c) => (
                          <div key={c.label} className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${c.bgColor} flex items-center justify-center shrink-0`}>
                              <i className={`ti ${c.icon} text-base ${c.iconColor}`} aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-700 truncate">{c.label}</div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-[#2E7BD4] rounded-full" style={{ width: `${total > 0 ? (c.count / total) * 100 : 0}%` }} />
                              </div>
                            </div>
                            <span className="text-sm font-bold text-[#0F2A4A] shrink-0">{c.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* solicitações urgentes */}
                {urgentes > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <i className="ti ti-flame text-red-500 text-xl" aria-hidden="true" />
                      <h2 className="text-base font-bold text-red-700">Solicitações Urgentes</h2>
                      <span className="ml-auto text-xs bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-full">{urgentes}</span>
                    </div>
                    <div className="space-y-2">
                      {solicitacoes.filter((s) => s.prioridade === "URGENTE").slice(0, 4).map((s) => (
                        <div key={s.id} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-red-100">
                          <span className="text-xs font-mono text-slate-400">#{s.id}</span>
                          <span className="text-sm font-semibold text-slate-800 flex-1 truncate">{s.descricao}</span>
                          <Badge status={STATUS_LABEL[s.status] || s.status} variant={STATUS_VARIANT[s.status] || "blue"} />
                          <button
                            onClick={() => setDetalheModal(s)}
                            className="text-xs text-red-600 font-semibold hover:underline"
                          >
                            Ver detalhes
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ╔══════════════════════════════════════════╗
                ║  ABA: SOLICITAÇÕES                       ║
                ╚══════════════════════════════════════════╝ */}
            {tab === "solicitacoes" && (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-extrabold text-[#0F2A4A]">Solicitações</h1>
                    <p className="text-slate-400 text-sm mt-1">Visualize e gerencie as demandas cadastradas na plataforma.</p>
                  </div>
                </div>

                {/* filtros */}
                <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" aria-hidden="true" />
                    <input
                      value={solBusca}
                      onChange={(e) => setSolBusca(e.target.value)}
                      placeholder="Buscar por descrição ou ID..."
                      className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-sm w-64 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <select
                    value={solFiltroStatus}
                    onChange={(e) => setSolFiltroStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  >
                    <option value="ABERTO">Aberto</option>
                    <option value="TRIAGEM">Em triagem</option>
                    <option value="EM_EXECUCAO">Em execução</option>
                    <option value="RESOLVIDO">Resolvido</option>
                    <option value="ENCERRADO">Encerrado</option>
                  </select>

                  <select
                    value={solFiltroCategoria}
                    onChange={(e) => setSolFiltroCategoria(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  >
                    <option value="todas">Todas as categorias</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id.toUpperCase()}>{c.label}</option>
                    ))}
                  </select>

                  <span className="ml-auto text-xs text-slate-400 font-semibold">{solFiltradas.length} resultado(s)</span>
                </div>

                {/* tabela */}
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead className="bg-slate-50">
                        <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Categoria / Descrição</th>
                          <th className="px-6 py-4">Prioridade</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solFiltradas.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                              Nenhuma solicitação encontrada com os filtros aplicados.
                            </td>
                          </tr>
                        ) : (
                          solFiltradas.map((s) => (
                            <tr
                              key={s.id}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                              onClick={() => setDetalheModal(s)}
                            >
                              <td className="px-6 py-4 text-xs font-mono text-slate-400">#{s.id}</td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-sm text-[#0F2A4A]">
                                  {s.categoria.replace(/_/g, " ")}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">{s.descricao}</div>
                              </td>
                              <td className="px-6 py-4">
                                {/* prioridade visível mas não editável */}
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${PRIORIDADE_COLOR[s.prioridade as Prioridade] || "bg-slate-100 text-slate-600"}`}>
                                  {s.prioridade}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  status={STATUS_LABEL[s.status] || s.status}
                                  variant={STATUS_VARIANT[s.status] || "blue"}
                                />
                              </td>
                              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => { setStatusModal({ open: true, id: s.id }); setNovoStatus(s.status); }}
                                  className="flex items-center gap-1 text-xs font-semibold text-[#2E7BD4] hover:underline"
                                >
                                  <i className="ti ti-refresh text-sm" aria-hidden="true" />
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

      {/* ── MODAL: DETALHES DA SOLICITAÇÃO ────────────────────────────────── */}
      {detalheModal && (() => {
        const s = detalheModal;
        const rawDate = (s as any).createdAt ?? s.dataAbertura;
        const displayDate = rawDate ? new Date(rawDate).toLocaleDateString("pt-BR") : "—";
        const displayAddress = (s as any).endereco ?? "—";

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
                    {s.categoria.replace(/_/g, " ")}
                  </h2>
                  <p className="text-xs text-white/60 mt-0.5">
                    {s.protocoloNumero ?? `PRF-${s.id}`} · #{s.id}
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
                {/* status + prioridade + data */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    status={STATUS_LABEL[s.status] || s.status}
                    variant={STATUS_VARIANT[s.status] || "blue"}
                  />
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${PRIORIDADE_COLOR[s.prioridade as Prioridade] || "bg-slate-100 text-slate-600"}`}>
                    {s.prioridade}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                    <i className="ti ti-calendar text-sm" aria-hidden="true" />
                    {displayDate}
                  </span>
                </div>

                {/* local */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Local</p>
                  <p className="text-sm text-slate-700 flex items-start gap-2">
                    <i className="ti ti-map-pin text-base text-slate-400 mt-0.5 shrink-0" aria-hidden="true" />
                    {displayAddress}
                  </p>
                </div>

                <div className="border-t border-slate-100" />

                {/* descrição */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Descrição</p>
                  {s.descricao ? (
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                      {s.descricao}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Nenhuma descrição fornecida.</p>
                  )}
                </div>

                {/* observações, se existirem */}
                {s.observacoes && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Observações</p>
                    <p className="text-sm text-slate-700 leading-relaxed bg-amber-50 rounded-2xl px-4 py-3 border border-amber-100">
                      {s.observacoes}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => {
                      setDetalheModal(null);
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

      {statusModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#0F2A4A] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Alterar Status</h2>
                <p className="text-sm text-white/60 mt-0.5">Solicitação #{statusModal.id}</p>
              </div>
              <button onClick={() => setStatusModal({ open: false, id: null })} className="text-white/70 hover:text-white">
                <i className="ti ti-x text-lg" aria-hidden="true" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Selecione o novo status</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "ABERTO",      label: "Aberto" },
                    { value: "TRIAGEM",     label: "Em Triagem" },
                    { value: "EM_EXECUCAO", label: "Em Execução" },
                    { value: "RESOLVIDO",   label: "Resolvido" },
                    { value: "ENCERRADO",   label: "Encerrado" },
                  ].map((opt) => (
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