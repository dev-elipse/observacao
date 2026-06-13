import React, { useState } from "react";
import { authService, UsuarioDTO } from "../../services/api";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onBack: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onBack }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<"CIDADAO" | "FUNCIONARIO_PUBLICO" | "GESTOR">("CIDADAO");
  const [cargo, setCargo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isCidadao = tipo === "CIDADAO";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setError("Nome, e-mail e senha são obrigatórios.");
      return;
    }

    if (!isCidadao && !cargo.trim()) {
      setError("Cargo é obrigatório para Funcionário Público e Gestor.");
      return;
    }

    setLoading(true);
    try {
      const novoUsuario: Omit<UsuarioDTO, "id"> & { senha: string } = {
        nome,
        email,
        senha,
        tipo,
        ...(cargo.trim() ? { cargo } : {}),
      };

      const response = await authService.register(novoUsuario);
      authService.saveAuth(response.usuario, response.token);
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    onSignupSuccess();
  };

  return (
    <div className="font-sans bg-gradient-to-br from-blue-50 via-white to-slate-100 min-h-screen flex items-center justify-center px-4">
      <button
        onClick={onBack}
        className="fixed top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors font-medium z-40"
      >
        <i className="ti ti-arrow-left text-lg" aria-hidden="true" />
        Voltar
      </button>

      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-[#0F2A4A] flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-user-plus text-white text-xl" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F2A4A] mb-2">
            Observ<span className="text-[#2E7BD4]">Ação</span>
          </h1>
          <p className="text-slate-500 text-sm">Crie sua conta para começar</p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <i className="ti ti-alert-circle" aria-hidden="true" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NOME */}
            <div>
              <label htmlFor="nome" className="block text-sm font-semibold text-slate-800 mb-2">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>

            {/* TIPO */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-semibold text-slate-800 mb-2">
                Tipo de Usuário <span className="text-red-500">*</span>
              </label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value as typeof tipo);
                  setCargo("");
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              >
                <option value="CIDADAO">Cidadão</option>
                <option value="FUNCIONARIO_PUBLICO">Funcionário Público</option>
                <option value="GESTOR">Gestor</option>
              </select>
            </div>

            {/* CARGO — só aparece para não-cidadãos */}
            {!isCidadao && (
              <div>
                <label htmlFor="cargo" className="block text-sm font-semibold text-slate-800 mb-2">
                  Cargo <span className="text-red-500">*</span>
                </label>
                <input
                  id="cargo"
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ex: Agente de fiscalização"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
            )}

            {/* SENHA */}
            <div>
              <label htmlFor="senha" className="block text-sm font-semibold text-slate-800 mb-2">
                Senha <span className="text-red-500">*</span>
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F2A4A] text-white rounded-lg px-4 py-3 text-sm font-bold hover:bg-[#1A3D6B] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <i className="ti ti-loader animate-spin" aria-hidden="true" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <i className="ti ti-user-plus" aria-hidden="true" />
                  Criar Conta
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-500">Ou</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="w-full border border-slate-200 text-slate-800 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Já tenho uma conta
          </button>
        </div>

        <div className="text-center text-xs text-slate-500">
          <p>
            Ao se registrar, você concorda com nossos{" "}
            <button className="text-[#2E7BD4] hover:underline font-medium">
              Termos de Uso
            </button>
          </p>
        </div>
      </div>

      {/* MODAL DE SUCESSO */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ti ti-check text-3xl text-green-600" aria-hidden="true" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#0F2A4A] text-center mb-2">Tudo certo!</h2>
            <p className="text-slate-600 text-center text-sm mb-6">
              Sua conta foi criada com sucesso.
            </p>
            <button
              onClick={handleSuccessConfirm}
              className="w-full bg-[#0F2A4A] text-white rounded-lg px-4 py-3 text-sm font-bold hover:bg-[#1A3D6B] transition-colors"
            >
              Continuar para o login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;