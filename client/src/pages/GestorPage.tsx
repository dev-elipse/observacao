import React, { useState, useEffect } from "react";
import { CATEGORIES } from "../constants";
import { ocorrenciaService } from "../services/api";
import type {
  OcorrenciaResponseDTO,
  OcorrenciaCreateDTO,
  CategoriaOcorrencia,
  PrioridadeOcorrencia,
  StatusOcorrencia,
} from "../services/api";
import Badge from "../components/Badge";

interface GestorPageProps {
  onBack: () => void;
}

type GestorTab = "dashboard" | "ocorrencias";

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

const emptyForm = (): OcorrenciaCreateDTO => ({
  titulo: "",
  descricao: "",
  categoria: "OUTROS",
  endereco: { rua: "", numero: "", bairro: "" },
  prioridade: "MEDIA",
  status: "ABERTA",
});

const GestorPage: React.FC<GestorPageProps> = ({ onBack }) => {
  const [tab, setTab] = useState<GestorTab>("dashboard");

  const [ocorrencias, setOcorrencias] = useState<OcorrenciaResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [busca, setBusca] = useState("");

  const [formModal, setFormModal] = useState<{
    open: boolean;
    editingId: string | null;
  }>({ open: false, editingId: null });
  const [form, setForm] = useState<OcorrenciaCreateDTO>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

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

  // ── indicadores ────────────────────────────────────────────────────────

  const total = ocorrencias.length;

  const porStatus = STATUS_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.value,
    count: ocorrencias.filter((o) => o.status === opt.value).length,
  }));

  const porPrioridade = (["ALTA", "MEDIA", "BAIXA"] as PrioridadeOcorrencia[]).map(
    (p) => ({
      label: p,
      count: ocorrencias.filter((o) => o.prioridade === p).length,
    }),
  );

  const porCategoria = CATEGORIES.map((cat) => ({
    label: cat.label,
    icon: cat.icon,
    iconColor: cat.iconColor,
    bgColor: cat.bgColor,
    count: ocorrencias.filter((o) => o.categoria === cat.categoria).length,
  })).sort((a, b) => b.count - a.count);

  const maxStatusCount = Math.max(1, ...porStatus.map((s) => s.count));
  const maxCategoriaCount = Math.max(1, ...porCategoria.map((c) => c.count));

  // ── filtros da lista ──────────────────────────────────────────────────

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

  // ── formulário (criar / editar) ──────────────────────────────────────

  const openCreateModal = () => {
    setForm(emptyForm());
    setFormError("");
    setFormModal({ open: true, editingId: null });
  };

  const openEditModal = (o: OcorrenciaResponseDTO) => {
    setForm({
      titulo: o.titulo,
      descricao: o.descricao,
      categoria: o.categoria,
      endereco: { ...o.endereco },
      prioridade: o.prioridade,
      status: o.status,
    });
    setFormError("");
    setFormModal({ open: true, editingId: o.id });
  };

  const closeFormModal = () => {
    setFormModal({ open: false, editingId: null });
    setForm(emptyForm());
    setFormError("");
  };

  const formValid =
    form.titulo.trim().length > 0 &&
    form.descricao.trim().length > 0 &&
    form.endereco.rua.trim().length > 0 &&
    form.endereco.numero.trim().length > 0 &&
    form.endereco.bairro.trim().length > 0;

  const handleSave = async () => {
    if (!formValid) return;
    try {
      setSaving(true);
      setFormError("");

      if (formModal.editingId) {
        await ocorrenciaService.update(formModal.editingId, form);
      } else {
        await ocorrenciaService.create(form);
      }

      await carregar();
      closeFormModal();
    } catch (err) {
      setFormError(
        "Erro ao salvar: " +
          (err instanceof Error ? err.message : "Erro desconhecido"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta ocorrência?")) {
      return;
    }
    try {
      await ocorrenciaService.delete(id);
      await carregar();
    } catch (err) {
      alert(
        "Erro ao excluir: " +
          (err instanceof Error ? err.message : "Erro desconhecido"),
      );
    }
  };

  const TABS: { id: GestorTab; label: string; icon: string }[] = [
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
                  Painel do Gestor
                </h1>

                <div className="bg-white border border-slate-100 rounded-2xl px-6 py-6 mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <i className="ti ti-file-text text-2xl text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">
                      Total de ocorrências registradas
                    </div>
                    <div className="text-3xl font-extrabold text-[#0F2A4A]">
                      {total}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* status */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6">
                    <h2 className="text-base font-bold mb-5 text-[#0F2A4A]">
                      Ocorrências por Status
                    </h2>
                    <div className="space-y-3">
                      {porStatus.map((s) => (
                        <div key={s.value}>
                          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                            <span>{s.label}</span>
                            <span>{s.count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-[#2E7BD4] rounded-full"
                              style={{
                                width: `${(s.count / maxStatusCount) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* prioridade */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6">
                    <h2 className="text-base font-bold mb-5 text-[#0F2A4A]">
                      Ocorrências por Prioridade
                    </h2>
                    <div className="space-y-4">
                      {porPrioridade.map((p) => (
                        <div
                          key={p.label}
                          className="flex items-center justify-between"
                        >
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              PRIORIDADE_COLOR[p.label] ??
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {p.label}
                          </span>
                          <span className="text-lg font-extrabold text-[#0F2A4A]">
                            {p.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6">
                  <h2 className="text-base font-bold mb-5 text-[#0F2A4A]">
                    Ocorrências por Categoria
                  </h2>
                  {porCategoria.every((c) => c.count === 0) ? (
                    <p className="text-sm text-slate-400">
                      Nenhuma ocorrência registrada ainda.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {porCategoria.map((c) => (
                        <div key={c.label} className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg ${c.bgColor} flex items-center justify-center shrink-0`}
                          >
                            <i
                              className={`ti ${c.icon} text-base ${c.iconColor}`}
                            />
                          </div>
                          <div className="w-40 text-sm font-semibold text-slate-600 shrink-0">
                            {c.label}
                          </div>
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-[#0F2A4A] rounded-full"
                              style={{
                                width: `${(c.count / maxCategoriaCount) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="w-6 text-right text-sm font-bold text-slate-500">
                            {c.count}
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
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-extrabold text-[#0F2A4A]">
                    Ocorrências
                  </h1>
                  <button
                    onClick={openCreateModal}
                    className="flex items-center gap-1.5 bg-[#0F2A4A] text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-[#1A3D6B] transition-colors"
                  >
                    <i className="ti ti-plus text-base" aria-hidden="true" />
                    Nova Ocorrência
                  </button>
                </div>

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
                          <th className="px-6 py-4">Ações</th>
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
                              className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
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
                              <td className="px-6 py-4 align-top">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => openEditModal(s)}
                                    className="flex items-center gap-1 text-xs font-semibold text-[#2E7BD4] hover:underline"
                                  >
                                    <i className="ti ti-edit text-sm" />
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDelete(s.id)}
                                    className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                                  >
                                    <i className="ti ti-trash text-sm" />
                                    Excluir
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
          </>
        )}
      </main>

      {/* MODAL: CRIAR / EDITAR OCORRÊNCIA */}
      {formModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-[#0F2A4A] px-8 py-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {formModal.editingId ? "Editar Ocorrência" : "Nova Ocorrência"}
              </h2>
              <button
                onClick={closeFormModal}
                className="text-white/80 hover:text-white"
              >
                <i className="ti ti-x text-lg" aria-hidden="true" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              {formError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={form.categoria}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoria: e.target.value as CategoriaOcorrencia,
                      })
                    }
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.categoria}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={form.prioridade}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        prioridade: e.target.value as PrioridadeOcorrencia,
                      })
                    }
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Normal</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rua
                  </label>
                  <input
                    type="text"
                    value={form.endereco.rua}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endereco: { ...form.endereco, rua: e.target.value },
                      })
                    }
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número
                  </label>
                  <input
                    type="text"
                    value={form.endereco.numero}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endereco: { ...form.endereco, numero: e.target.value },
                      })
                    }
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
                  value={form.endereco.bairro}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      endereco: { ...form.endereco, bairro: e.target.value },
                    })
                  }
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              {formModal.editingId && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as StatusOcorrencia,
                      })
                    }
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  rows={5}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !formValid}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#0F2A4A] text-white text-sm font-bold hover:bg-[#1A3D6B] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <i className="ti ti-loader animate-spin" />
                      Salvando...
                    </>
                  ) : formModal.editingId ? (
                    "Salvar alterações"
                  ) : (
                    "Registrar ocorrência"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestorPage;
