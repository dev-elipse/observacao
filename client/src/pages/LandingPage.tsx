import React, { useState } from "react";
import { CATEGORIES, STEPS } from "../constants";

interface LandingPageProps {
  onLogin: () => void;
  onSignup?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  const [protocol, setProtocol] = useState("");

  return (
    <div className="font-sans bg-white min-h-screen text-slate-800">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between px-10 h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F2A4A] flex items-center justify-center">
            <i className="ti ti-eye text-white text-base" aria-hidden="true" />
          </div>
          <span className="font-bold text-lg text-[#0F2A4A] tracking-tight">
            Observ<span className="text-[#2E7BD4]">Ação</span>
          </span>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onLogin}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={onSignup || onLogin}
            className="bg-[#0F2A4A] text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-[#1A3D6B] transition-colors"
          >
            Registrar
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-[1180px] mx-auto px-10 py-20 grid grid-cols-[1fr_420px] gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wide">
            <i className="ti ti-map-2 text-[13px]" aria-hidden="true" />{" "}
            PLATAFORMA GOVTECH
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.1] mb-5 tracking-tight text-[#0F2A4A]">
            Serviços Públicos
            <br />
            <span className="text-[#2E7BD4]">mais perto</span> de você.
          </h1>

          <p className="text-lg text-slate-500 leading-relaxed mb-9 max-w-[480px]">
            O ObservAção conecta você ao poder público. Registre demandas do seu
            bairro, acompanhe a resolução em tempo real e ajude a construir uma
            cidade melhor para todos.
          </p>
        </div>

        {/* ACTION CARDS */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0F2A4A] rounded-2xl p-7 text-white">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-4">
              <i className="ti ti-plus text-white text-xl" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold mb-2">Nova Solicitação</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              Relate um problema estrutural, de manutenção ou serviço na sua
              rua. De forma identificada ou anônima.
            </p>
            <button
              onClick={onLogin}
              className="bg-white/15 border border-white/25 text-white rounded-lg px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5 hover:bg-white/25 transition-colors"
            >
              Iniciar registro{" "}
              <i className="ti ti-arrow-right text-sm" aria-hidden="true" />
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <i
                  className="ti ti-search text-lg text-slate-500"
                  aria-hidden="true"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0F2A4A]">
                  Acompanhar Solicitação
                </div>
                <div className="text-xs text-slate-400">
                  Digite o número do protocolo
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                placeholder="Ex: PRF-2023-10-00123"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button className="bg-[#2E7BD4] text-white rounded-lg px-4 text-sm font-bold hover:bg-blue-600 transition-colors">
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-slate-50 py-20 px-10">
        <div className="max-w-[1180px] mx-auto">
          <div className="mb-9">
            <h2 className="text-3xl font-extrabold mb-2 text-[#0F2A4A]">
              Categorias de Atendimento
            </h2>
            <p className="text-slate-400 text-sm">
              Estas categorias são informativas e mostram os tipos de serviços
              disponíveis.
            </p>
          </div>
          <div className="grid grid-cols-7 gap-3.5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="bg-white border border-slate-100 rounded-2xl py-5 px-3 flex flex-col items-center gap-3"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${cat.bgColor} flex items-center justify-center`}
                >
                  <i
                    className={`ti ${cat.icon} text-2xl ${cat.iconColor}`}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 text-center leading-tight">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-10">
        <div className="max-w-[1180px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold mb-3 text-[#0F2A4A]">
              Como Funciona o Fluxo?
            </h2>
            <p className="text-slate-400 text-sm">
              Um processo simples, transparente e rastreável.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-start">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#0F2A4A] flex items-center justify-center">
                    <i
                      className={`ti ${s.icon} text-white text-xl`}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 tracking-wider">
                    PASSO {s.n}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#0F2A4A]">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F2A4A] text-white/60 px-10 py-8">
        <div className="max-w-[1180px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center">
              <i className="ti ti-eye text-white text-sm" aria-hidden="true" />
            </div>
            <span className="text-white font-bold text-sm">ObservAção</span>
          </div>
          <div className="text-xs">
            © 2026 ObservAção. Solução GovTech de Transparência.
          </div>
          <div className="flex gap-5 text-sm">
            {["Termos de Uso", "Privacidade", "Contato"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-white/60 hover:text-white transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
