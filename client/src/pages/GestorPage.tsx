import React, { useState, useEffect } from "react";
import { CATEGORIES } from "../constants";
import { solicitacaoService, usuarioService } from "../services/api";
import type { SolicitacaoResponseDTO, UsuarioDTO } from "../services/api";
import Badge from "../components/Badge";

interface GestorPageProps {
  onLogout: () => void;
}

// ─── tipos auxiliares ────────────────────────────────────────────────────────

type GestorTab = "dashboard" | "solicitacoes" | "usuarios" | "logs";

interface LogEntry {
  id: number;
  acao: string;
  alvo: string;
  responsavel: string;
  data: string;
  tipo: "prioridade" | "reatribuicao" | "status" | "usuario";
}

interface SLAData {
  label: string;
  dentro: number;
  fora: number;
  total: number;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const PRIORIDADE_OPTS = ["BAIXA", "MEDIA", "ALTA", "URGENTE"] as const;
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

// mock de logs já que o backend ainda não expõe essa rota como REST padrão
const MOCK_LOGS: LogEntry[] = [
  { id: 1, acao: "Prioridade alterada para URGENTE", alvo: "SOL-001", responsavel: "admin@observacao.br", data: "11/06/2026 14:32", tipo: "prioridade" },
  { id: 2, acao: "Solicitação reatribuída para João Técnico", alvo: "SOL-003", responsavel: "gestor@observacao.br", data: "11/06/2026 13:10", tipo: "reatribuicao" },
  { id: 3, acao: "Usuário criado: Maria Silva (CIDADAO)", alvo: "USR-012", responsavel: "admin@observacao.br", data: "11/06/2026 11:48", tipo: "usuario" },
  { id: 4, acao: "Status alterado para CONCLUIDO", alvo: "SOL-010", responsavel: "joao@observacao.br", data: "10/06/2026 17:20", tipo: "status" },
  { id: 5, acao: "Prioridade alterada para ALTA", alvo: "SOL-007", responsavel: "gestor@observacao.br", data: "10/06/2026 15:55", tipo: "prioridade" },
  { id: 6, acao: "Solicitação reatribuída para Ana Técnica", alvo: "SOL-005", responsavel: "admin@observacao.br", data: "10/06/2026 09:30", tipo: "reatribuicao" },
];

const LOG_ICON: Record<LogEntry["tipo"], string> = {
  prioridade: "ti-flag",
  reatribuicao: "ti-arrows-exchange",
  status: "ti-circle-check",
  usuario: "ti-user-plus",
};

const LOG_COLOR: Record<LogEntry["tipo"], string> = {
  prioridade: "text-orange-500 bg-orange-50",
  reatribuicao: "text-blue-500 bg-blue-50",
  status: "text-emerald-600 bg-emerald-50",
  usuario: "text-purple-500 bg-purple-50",
};

// ─── componente principal ─────────────────────────────────────────────────────

const GestorPage: React.FC<GestorPageProps> = ({ onLogout }) => {
  const [tab, setTab] = useState<GestorTab>("dashboard");
  const [showProfile, setShowProfile] = useState(false);

  // dados
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoResponseDTO[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // modais
  const [prioridadeModal, setPrioridadeModal] = useState<{ open: boolean; id: number | null; atual: string }>({ open: false, id: null, atual: "" });
  const [reatribuirModal, setReatribuirModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [novoUsuarioModal, setNovoUsuarioModal] = useState(false);

  // filtros solicitações
  const [solFiltroStatus, setSolFiltroStatus] = useState("todos");
  const [solFiltroCategoria, setSolFiltroCategoria] = useState("todas");
  const [solBusca, setSolBusca] = useState("");

  // filtros usuários
  const [usrFiltroTipo, setUsrFiltroTipo] = useState("todos");
  const [usrBusca, setUsrBusca] = useState("");

  // form novo usuário
  const [novoUsr, setNovoUsr] = useState({ nome: "", email: "", tipo: "CIDADAO", senha: "", cargo: "" });
  const [novoUsrLoading, setNovoUsrLoading] = useState(false);
  const [novoUsrError, setNovoUsrError] = useState("");

  // prioridade form
  const [novaPrioridade, setNovaPrioridade] = useState<Prioridade>("MEDIA");

  // reatribuição form
  const [usuarioReatribuicao, setUsuarioReatribuicao] = useState<number | "">("");

  const [selectedRequest, setSelectedRequest] = useState<SolicitacaoResponseDTO | null>(null);

  // ── carregamento de dados ──────────────────────────────────────────────────

  const carregar = async () => {
    try {
      setLoading(true);
      setError("");
      const [sols, usrs] = await Promise.all([
        solicitacaoService.getAll(),
        usuarioService.getAll(),
      ]);
      setSolicitacoes(sols || []);
      setUsuarios(usrs || []);
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

  const slaData: SLAData[] = [
    { label: "BAIXA", dentro: Math.max(0, solicitacoes.filter((s) => s.prioridade === "BAIXA").length - 1), fora: 1, total: solicitacoes.filter((s) => s.prioridade === "BAIXA").length },
    { label: "MÉDIA", dentro: solicitacoes.filter((s) => s.prioridade === "MEDIA" && s.status === "CONCLUIDO").length, fora: solicitacoes.filter((s) => s.prioridade === "MEDIA" && s.status !== "CONCLUIDO").length, total: solicitacoes.filter((s) => s.prioridade === "MEDIA").length },
    { label: "ALTA", dentro: solicitacoes.filter((s) => s.prioridade === "ALTA" && s.status === "CONCLUIDO").length, fora: solicitacoes.filter((s) => s.prioridade === "ALTA" && s.status !== "CONCLUIDO").length, total: solicitacoes.filter((s) => s.prioridade === "ALTA").length },
    { label: "URGENTE", dentro: solicitacoes.filter((s) => s.prioridade === "URGENTE" && s.status === "CONCLUIDO").length, fora: solicitacoes.filter((s) => s.prioridade === "URGENTE" && s.status !== "CONCLUIDO").length, total: solicitacoes.filter((s) => s.prioridade === "URGENTE").length },
  ];

  // ── solicitações filtradas ─────────────────────────────────────────────────

  const CATEGORY_ID_TO_ENUM: Record<string, string> = {
    ILUMINACAO:  "ILUMINACAO_PUBLICA",
    BURACO:      "INFRAESTRUTURA_URBANA",
    LIMPEZA:     "LIMPEZA_URBANA",
    SAUDE:       "SAUDE_PUBLICA",
    SEGURANCA:   "SEGURANCA_PUBLICA",
    PODA:        "MEIO_AMBIENTE",
    OUTROS:      "OUTROS",
  };

  const solFiltradas = solicitacoes.filter((s) => {
    const statusOk = solFiltroStatus === "todos" || s.status === solFiltroStatus;
    const catEnum = CATEGORY_ID_TO_ENUM[solFiltroCategoria] ?? solFiltroCategoria;
    const catOk = solFiltroCategoria === "todas" || s.categoria === catEnum;
    const buscaOk = !solBusca || s.descricao.toLowerCase().includes(solBusca.toLowerCase()) || String(s.id).includes(solBusca);
    return statusOk && catOk && buscaOk;
  });

  // ── usuários filtrados ─────────────────────────────────────────────────────

  const usrFiltrados = usuarios.filter((u) => {
    const tipoOk = usrFiltroTipo === "todos" || u.tipo === usrFiltroTipo;
    const buscaOk = !usrBusca || u.nome.toLowerCase().includes(usrBusca.toLowerCase()) || (u.email || "").toLowerCase().includes(usrBusca.toLowerCase());
    return tipoOk && buscaOk;
  });

  // ── ações ──────────────────────────────────────────────────────────────────

  const handleAlterarPrioridade = async () => {
  if (!prioridadeModal.id) return;
  try {
    const solicitacaoAtual = solicitacoes.find((s) => s.id === prioridadeModal.id);
    if (!solicitacaoAtual) throw new Error("Solicitação não encontrada");

    await solicitacaoService.update(prioridadeModal.id, {
      categoria: solicitacaoAtual.categoria,
      descricao: solicitacaoAtual.descricao,
      prioridade: novaPrioridade,
      anonima: solicitacaoAtual.anonima,
      usuarioId: solicitacaoAtual.usuarioId ?? undefined,
      endereco: (solicitacaoAtual as any).endereco ?? "",
    } as any);

    await carregar();
    setPrioridadeModal({ open: false, id: null, atual: "" });
  } catch (err) {
    console.error(err);
    alert("Erro ao alterar prioridade. Verifique se o backend está rodando.");
  }
};

  const handleReatribuir = async () => {
    if (!reatribuirModal.id || !usuarioReatribuicao) return;
    try {
      await solicitacaoService.update(reatribuirModal.id, { usuarioId: Number(usuarioReatribuicao) } as any);
      await carregar();
      setReatribuirModal({ open: false, id: null });
      setUsuarioReatribuicao("");
    } catch {
      alert("Erro ao reatribuir.");
    }
  };

  const handleCriarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setNovoUsrError("");
    if (!novoUsr.nome || !novoUsr.email || !novoUsr.senha) {
      setNovoUsrError("Nome, e-mail e senha são obrigatórios.");
      return;
    }
    if (novoUsr.tipo !== "CIDADAO" && !novoUsr.cargo) {
      setNovoUsrError("Cargo é obrigatório para Funcionário Público e Gestor.");
      return;
    }
    try {
      setNovoUsrLoading(true);
      await usuarioService.create({ nome: novoUsr.nome, email: novoUsr.email, tipo: novoUsr.tipo as any, cargo: novoUsr.cargo || undefined, senha: novoUsr.senha } as any);
      await carregar();
      setNovoUsuarioModal(false);
      setNovoUsr({ nome: "", email: "", tipo: "CIDADAO", senha: "", cargo: "" });
    } catch {
      setNovoUsrError("Erro ao criar usuário. Verifique se o e-mail já existe.");
    } finally {
      setNovoUsrLoading(false);
    }
  };

  // ── navegação ──────────────────────────────────────────────────────────────

  const TABS: { id: GestorTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
    { id: "solicitacoes", label: "Solicitações", icon: "ti-file-text" },
    { id: "usuarios", label: "Usuários", icon: "ti-users" },
    { id: "logs", label: "Auditoria", icon: "ti-clipboard-list" },
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
            <span className="ml-2 text-[10px] font-bold bg-amber-400 text-[#0F2A4A] px-2 py-0.5 rounded-full tracking-wide">
              GESTOR
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
              <div className="text-sm font-bold text-white">Admin Gestor</div>
              <div className="text-[11px] text-white/50">Acesso total</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
              <span className="text-[13px] font-bold text-[#0F2A4A]">AG</span>
            </div>
            <i className="ti ti-chevron-down text-white/60 text-sm" aria-hidden="true" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-slate-100 rounded-xl p-2 w-48 shadow-lg z-50">
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
                  <h1 className="text-3xl font-extrabold text-[#0F2A4A]">Painel de Gestão</h1>
                  <p className="text-slate-400 text-sm mt-1">Visão geral de desempenho, SLA e distribuição de demandas.</p>
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
                  {/* SLA por prioridade */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6">
                    <h2 className="text-base font-bold text-[#0F2A4A] mb-1">SLA por Prioridade</h2>
                    <p className="text-xs text-slate-400 mb-6">Proporção de solicitações dentro e fora do prazo por nível de prioridade.</p>
                    <div className="space-y-5">
                      {slaData.map((row) => {
                        const pct = row.total > 0 ? Math.round((row.dentro / row.total) * 100) : 0;
                        const barColor = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-500";
                        return (
                          <div key={row.label}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-semibold text-slate-700">{row.label}</span>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="text-emerald-600 font-semibold">{row.dentro} dentro</span>
                                <span className="text-red-500 font-semibold">{row.fora} fora</span>
                                <span className="font-bold text-slate-700">{pct}%</span>
                              </div>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${barColor} rounded-full transition-all`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
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
                                <div
                                  className="h-full bg-[#2E7BD4] rounded-full"
                                  style={{ width: `${total > 0 ? (c.count / total) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-bold text-[#0F2A4A] shrink-0">{c.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* últimas solicitações urgentes */}
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
                            onClick={() => { setPrioridadeModal({ open: true, id: s.id, atual: s.prioridade }); setNovaPrioridade(s.prioridade as Prioridade); }}
                            className="text-xs text-red-600 font-semibold hover:underline"
                          >
                            Ajustar
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
                    <p className="text-slate-400 text-sm mt-1">Gerencie prioridade e atribuição de todas as demandas.</p>
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
                          <th className="px-6 py-4">Responsável</th>
                          <th className="px-6 py-4">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solFiltradas.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                              Nenhuma solicitação encontrada com os filtros aplicados.
                            </td>
                          </tr>
                        ) : (
                          solFiltradas.map((s) => (
                            <tr
                              key={s.id}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                              onClick={() => setSelectedRequest(s)}
                            >
                              <td className="px-6 py-4 text-xs font-mono text-slate-400">#{s.id}</td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-sm text-[#0F2A4A]">
                                  {s.categoria.replace(/_/g, " ")}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">{s.descricao}</div>
                              </td>
                              <td className="px-6 py-4">
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
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {s.usuarioId
                                  ? usuarios.find((u) => u.id === s.usuarioId)?.nome || `ID ${s.usuarioId}`
                                  : <span className="text-slate-400 italic">Não atribuído</span>}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => { setPrioridadeModal({ open: true, id: s.id, atual: s.prioridade }); setNovaPrioridade(s.prioridade as Prioridade); }}
                                    className="flex items-center gap-1 text-xs font-semibold text-[#2E7BD4] hover:underline"
                                  >
                                    <i className="ti ti-flag text-sm" aria-hidden="true" />
                                    Prioridade
                                  </button>
                                  <span className="text-slate-300">|</span>
                                  <button
                                    onClick={() => { setReatribuirModal({ open: true, id: s.id }); setUsuarioReatribuicao(""); }}
                                    className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:underline"
                                  >
                                    <i className="ti ti-arrows-exchange text-sm" aria-hidden="true" />
                                    Reatribuir
                                  </button>
                                </div>
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

            {/* ╔══════════════════════════════════════════╗
                ║  ABA: USUÁRIOS                           ║
                ╚══════════════════════════════════════════╝ */}
            {tab === "usuarios" && (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-3xl font-extrabold text-[#0F2A4A]">Usuários</h1>
                    <p className="text-slate-400 text-sm mt-1">Gerencie os usuários cadastrados na plataforma.</p>
                  </div>
                  <button
                    onClick={() => setNovoUsuarioModal(true)}
                    className="flex items-center gap-2 bg-[#0F2A4A] text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-[#1A3D6B] transition-colors"
                  >
                    <i className="ti ti-user-plus text-base" aria-hidden="true" />
                    Novo usuário
                  </button>
                </div>

                {/* filtros */}
                <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" aria-hidden="true" />
                    <input
                      value={usrBusca}
                      onChange={(e) => setUsrBusca(e.target.value)}
                      placeholder="Buscar por nome ou e-mail..."
                      className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-sm w-64 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <select
                    value={usrFiltroTipo}
                    onChange={(e) => setUsrFiltroTipo(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  >
                    <option value="todos">Todos os tipos</option>
                    <option value="CIDADAO">Cidadão</option>
                    <option value="FUNCIONARIO_PUBLICO">Funcionário Público</option>
                    <option value="GESTOR">Gestor</option>
                  </select>
                  <span className="ml-auto text-xs text-slate-400 font-semibold">{usrFiltrados.length} usuário(s)</span>
                </div>

                {/* grid de usuários */}
                {usrFiltrados.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-sm">
                    Nenhum usuário encontrado.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {usrFiltrados.map((u) => {
                      const initials = u.nome.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
                      const tipoColor: Record<string, string> = {
                        CIDADAO: "bg-blue-50 text-blue-700",
                        FUNCIONARIO_PUBLICO: "bg-emerald-50 text-emerald-700",
                        GESTOR: "bg-purple-50 text-purple-700",
                      };
                      const tipoLabel: Record<string, string> = {
                        CIDADAO: "Cidadão",
                        FUNCIONARIO_PUBLICO: "Func. Público",
                        GESTOR: "Gestor",
                      };
                      return (
                        <div key={u.id} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#0F2A4A] flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-white">{initials}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-[#0F2A4A] truncate">{u.nome}</div>
                            <div className="text-xs text-slate-400 truncate mt-0.5">{u.email || "—"}</div>
                            {u.cargo && <div className="text-xs text-slate-500 mt-0.5 truncate">{u.cargo}</div>}
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 ${tipoColor[u.tipo] || "bg-slate-100 text-slate-600"}`}>
                              {tipoLabel[u.tipo] || u.tipo}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ╔══════════════════════════════════════════╗
                ║  ABA: AUDITORIA (LOGS)                   ║
                ╚══════════════════════════════════════════╝ */}
            {tab === "logs" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0F2A4A]">Auditoria</h1>
                  <p className="text-slate-400 text-sm mt-1">Registro imutável de todas as ações administrativas realizadas no sistema.</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                    <i className="ti ti-shield-check text-[#0F2A4A] text-lg" aria-hidden="true" />
                    <h2 className="font-bold text-sm text-[#0F2A4A]">Log de ações</h2>
                    <span className="ml-auto text-xs bg-slate-100 text-slate-500 font-semibold px-2.5 py-1 rounded-full">
                      {MOCK_LOGS.length} registros
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {MOCK_LOGS.map((log) => (
                      <div key={log.id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${LOG_COLOR[log.tipo]}`}>
                          <i className={`ti ${LOG_ICON[log.tipo]} text-base`} aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-800">{log.acao}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-400">
                              <span className="font-semibold text-slate-600">{log.alvo}</span>
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-400">por <span className="font-semibold text-slate-600">{log.responsavel}</span></span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0 font-mono">{log.data}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 italic">
                      Os logs de auditoria são exibidos em ordem cronológica decrescente. Integração com <code className="bg-slate-100 px-1 rounded text-[11px]">GET /gestor/logs</code> pendente de implementação no backend.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── MODAL: ALTERAR PRIORIDADE ──────────────────────────────────────── */}
      {prioridadeModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#0F2A4A] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Alterar Prioridade</h2>
                <p className="text-sm text-white/60 mt-0.5">Solicitação #{prioridadeModal.id}</p>
              </div>
              <button onClick={() => setPrioridadeModal({ open: false, id: null, atual: "" })} className="text-white/70 hover:text-white">
                <i className="ti ti-x text-lg" aria-hidden="true" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Selecione a nova prioridade</label>
                <div className="grid grid-cols-2 gap-3">
                  {PRIORIDADE_OPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setNovaPrioridade(p)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        novaPrioridade === p
                          ? "border-[#0F2A4A] bg-[#0F2A4A] text-white"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPrioridadeModal({ open: false, id: null, atual: "" })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAlterarPrioridade}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0F2A4A] text-white text-sm font-bold hover:bg-[#1A3D6B] transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: REATRIBUIR ─────────────────────────────────────────────── */}
      {reatribuirModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#0F2A4A] px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Reatribuir Solicitação</h2>
                <p className="text-sm text-white/60 mt-0.5">Solicitação #{reatribuirModal.id}</p>
              </div>
              <button onClick={() => setReatribuirModal({ open: false, id: null })} className="text-white/70 hover:text-white">
                <i className="ti ti-x text-lg" aria-hidden="true" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Selecione o responsável
                </label>
                <select
                  value={usuarioReatribuicao}
                  onChange={(e) => setUsuarioReatribuicao(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">Selecione um usuário...</option>
                  {usuarios
                    .filter((u) => u.tipo === "FUNCIONARIO_PUBLICO" || u.tipo === "GESTOR")
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} ({u.tipo === "GESTOR" ? "Gestor" : "Func. Público"})
                      </option>
                    ))}
                </select>
                {usuarios.filter((u) => u.tipo === "FUNCIONARIO_PUBLICO" || u.tipo === "GESTOR").length === 0 && (
                  <p className="text-xs text-slate-400 mt-2">Nenhum funcionário ou gestor cadastrado.</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setReatribuirModal({ open: false, id: null })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReatribuir}
                  disabled={!usuarioReatribuicao}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0F2A4A] text-white text-sm font-bold hover:bg-[#1A3D6B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: NOVO USUÁRIO ───────────────────────────────────────────── */}
      {novoUsuarioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#0F2A4A] px-6 py-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Novo Usuário</h2>
              <button onClick={() => { setNovoUsuarioModal(false); setNovoUsrError(""); }} className="text-white/70 hover:text-white">
                <i className="ti ti-x text-lg" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleCriarUsuario} className="p-6 space-y-4">
              {novoUsrError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {novoUsrError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    value={novoUsr.nome}
                    onChange={(e) => setNovoUsr({ ...novoUsr, nome: e.target.value })}
                    placeholder="Nome do usuário"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail *</label>
                  <input
                    type="email"
                    value={novoUsr.email}
                    onChange={(e) => setNovoUsr({ ...novoUsr, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo *</label>
                  <select
                    value={novoUsr.tipo}
                    onChange={(e) => setNovoUsr({ ...novoUsr, tipo: e.target.value, cargo: "" })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  >
                    <option value="CIDADAO">Cidadão</option>
                    <option value="FUNCIONARIO_PUBLICO">Funcionário Público</option>
                    <option value="GESTOR">Gestor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={novoUsr.senha}
                    onChange={(e) => setNovoUsr({ ...novoUsr, senha: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                {novoUsr.tipo !== "CIDADAO" && (
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cargo *</label>
                    <input
                      type="text"
                      value={novoUsr.cargo}
                      onChange={(e) => setNovoUsr({ ...novoUsr, cargo: e.target.value })}
                      placeholder="Ex: Agente de fiscalização"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setNovoUsuarioModal(false); setNovoUsrError(""); }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={novoUsrLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0F2A4A] text-white text-sm font-bold hover:bg-[#1A3D6B] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {novoUsrLoading ? (
                    <><i className="ti ti-loader animate-spin" aria-hidden="true" /> Criando...</>
                  ) : (
                    <><i className="ti ti-user-plus" aria-hidden="true" /> Criar usuário</>
                  )}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}
      {/*MODAL DETALHES DA SOLICITAÇÃO*/}
      {selectedRequest && (() => {
            const rawDate = (selectedRequest as any).createdAt ?? selectedRequest.dataAbertura;
            const displayDate = rawDate ? new Date(rawDate).toLocaleDateString("pt-BR") : "—";
            const displayAddress = (selectedRequest as any).endereco ?? "—";
            const statusLabel = STATUS_LABEL[selectedRequest.status] ?? selectedRequest.status;
            const statusColor =
              selectedRequest.status === "CONCLUIDO" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
              selectedRequest.status === "ABERTO"    ? "text-orange-600 bg-orange-50 border-orange-200" :
                                                      "text-sky-600 bg-sky-50 border-sky-200";

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
                          <i className="ti ti-file-text text-xl text-white" aria-hidden="true" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-white">
                            {selectedRequest.categoria.replace(/_/g, " ")}
                          </h2>
                          <p className="text-xs text-white/60 mt-0.5">
                            #{selectedRequest.id}
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
                    {/* Status + Prioridade + Data */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                        {statusLabel}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        selectedRequest.prioridade === "URGENTE" ? "bg-red-100 text-red-700" :
                        selectedRequest.prioridade === "ALTA"    ? "bg-orange-100 text-orange-700" :
                        selectedRequest.prioridade === "MEDIA"   ? "bg-blue-100 text-blue-700" :
                                                                  "bg-slate-100 text-slate-600"
                      }`}>
                        {selectedRequest.prioridade}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <i className="ti ti-calendar text-sm" aria-hidden="true" />
                        {displayDate}
                      </span>
                    </div>

                    {/* Responsável */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Responsável</p>
                      <p className="text-sm text-slate-700 flex items-center gap-2">
                        <i className="ti ti-user text-base text-slate-400 shrink-0" aria-hidden="true" />
                        {selectedRequest.usuarioId
                          ? usuarios.find((u) => u.id === selectedRequest.usuarioId)?.nome || `ID ${selectedRequest.usuarioId}`
                          : <span className="text-slate-400 italic">Não atribuído</span>
                        }
                      </p>
                    </div>

                    {/* Local */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Local</p>
                      <p className="text-sm text-slate-700 flex items-start gap-2">
                        <i className="ti ti-map-pin text-base text-slate-400 mt-0.5 shrink-0" aria-hidden="true" />
                        {displayAddress}
                      </p>
                    </div>

                    <div className="border-t border-slate-100" />

                    {/* Descrição */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Descrição da solicitação</p>
                      {selectedRequest.descricao ? (
                        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
                          {selectedRequest.descricao}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400 italic">Nenhuma descrição fornecida.</p>
                      )}
                    </div>

                    {/* Ações rápidas */}
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(null);
                          setPrioridadeModal({ open: true, id: selectedRequest.id, atual: selectedRequest.prioridade });
                          setNovaPrioridade(selectedRequest.prioridade as unknown as Prioridade);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <i className="ti ti-flag text-base" aria-hidden="true" />
                        Alterar Prioridade
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setPrioridadeModal({ open: true, id: selectedRequest.id, atual: selectedRequest.prioridade }); setNovaPrioridade((selectedRequest.prioridade as string) as Prioridade); }}
                        className="flex items-center gap-1 text-xs font-semibold text-[#2E7BD4] hover:underline"
                      >
                        <i className="ti ti-flag text-sm" aria-hidden="true" />
                        Prioridade
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setReatribuirModal({ open: true, id: selectedRequest.id }); setUsuarioReatribuicao(""); }}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:underline"
                      >
                        <i className="ti ti-arrows-exchange text-sm" aria-hidden="true" />
                        Reatribuir
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

export default GestorPage;