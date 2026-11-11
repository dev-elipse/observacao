import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { contaService } from "../services/api";
import type { ContaDTO } from "../services/api";

interface Props {
  modo: "cadastro" | "login";
  onBack: () => void;
  onModo: (modo: "cadastro" | "login") => void;
  onLogin: (conta: ContaDTO) => void;
}
const inputClass = "w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400";

export default function CidadaosPage({ modo, onBack, onModo, onLogin }: Props) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const enviando = useRef(false);
  const cadastro = modo === "cadastro";

  function mudarModo() { setError(""); setSuccess(""); setSenha(""); onModo(cadastro ? "login" : "cadastro"); }
  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando.current) return;
    if (cadastro && !nome.trim()) { setError("Informe seu nome completo."); return; }
    enviando.current = true; setBusy(true); setError(""); setSuccess("");
    try {
      if (cadastro) {
        await contaService.cadastrar({ nome: nome.trim(), cpf, email: email.trim(), telefone, senha });
        setSenha(""); setSuccess("Cadastro realizado. Entre com seu e-mail e senha."); onModo("login");
      } else {
        const conta = await contaService.entrar(email.trim(), senha);
        setSenha(""); onLogin(conta);
      }
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "";
      setError(mensagem.startsWith("Erro 409") ? "Este e-mail já está cadastrado. Entre na sua conta ou use outro e-mail."
        : mensagem.startsWith("Erro 401") ? "E-mail ou senha incorretos."
        : mensagem.startsWith("Erro 400") ? "Confira os campos informados."
        : "Não foi possível concluir. Verifique a conexão e tente novamente.");
    } finally { enviando.current = false; setBusy(false); }
  }

  return <div className="font-sans bg-slate-50 min-h-screen text-slate-800">
    <nav className="bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 h-16">
      <span className="font-bold text-[#0F2A4A]">Observ<span className="text-[#2E7BD4]">Ação</span></span>
      <button disabled={busy} onClick={onBack} className="text-sm font-semibold text-slate-500">Voltar ao início</button>
    </nav>
    <main className="max-w-xl mx-auto px-6 py-9">
      <h1 className="text-3xl font-extrabold text-[#0F2A4A]">{cadastro ? "Cadastro de cidadão" : "Entrar na sua conta"}</h1>
      <p className="text-sm text-slate-500 mt-2 mb-6">O cadastro é opcional. Você pode registrar ocorrências sem se identificar.</p>
      <div className="bg-white border border-slate-100 rounded-2xl p-6">
        {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="mb-4 text-sm text-emerald-700">{success}</p>}
        <form onSubmit={enviar}>
          <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
            {cadastro && <>
              <label className="block text-sm font-semibold">Nome completo
                <input required autoComplete="name" value={nome} onChange={e => setNome(e.target.value)} className={inputClass} />
              </label>
              <label className="block text-sm font-semibold">CPF
                <input required inputMode="numeric" pattern="[0-9]{11}" maxLength={14} value={cpf}
                  onChange={e => setCpf(e.target.value.replace(/\D/g, "").slice(0, 11))} className={inputClass} aria-describedby="cpf-ajuda" />
                <span id="cpf-ajuda" className="block mt-1 text-xs font-normal text-slate-500">Informe 11 dígitos. Para teste, pode usar 00000000000.</span>
              </label>
            </>}
            <label className="block text-sm font-semibold">E-mail
              <input required type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
            </label>
            {cadastro && <label className="block text-sm font-semibold">Telefone
              <input required type="tel" autoComplete="tel" pattern="[0-9]{10,11}" value={telefone}
                onChange={e => setTelefone(e.target.value.replace(/\D/g, "").slice(0, 11))} className={inputClass} placeholder="DDD e número" />
            </label>}
            <label className="block text-sm font-semibold">Senha
              <input required type="password" minLength={cadastro ? 8 : undefined} maxLength={128}
                autoComplete={cadastro ? "new-password" : "current-password"} value={senha} onChange={e => setSenha(e.target.value)} className={inputClass} />
              {cadastro && <span className="block mt-1 text-xs font-normal text-slate-500">Use pelo menos 8 caracteres.</span>}
            </label>
            <button type="submit" className="w-full px-5 py-3 rounded-xl bg-[#0F2A4A] text-white font-semibold text-sm">{busy ? "Aguarde..." : cadastro ? "Cadastrar" : "Entrar"}</button>
            <button type="button" onClick={mudarModo} className="w-full text-sm font-semibold text-[#2E7BD4]">{cadastro ? "Já tenho cadastro" : "Criar cadastro"}</button>
            <button type="button" onClick={onBack} className="w-full text-sm text-slate-500">Continuar sem cadastro</button>
          </fieldset>
        </form>
      </div>
    </main>
  </div>;
}
