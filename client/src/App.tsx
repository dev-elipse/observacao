import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GestorPage from "./pages/GestorPage";
import FuncionarioPage from "./pages/FuncionarioPage";
import CidadaosPage from "./pages/CidadaosPage";
import { contaService } from "./services/api";
import type { ContaDTO } from "./services/api";
import type { Screen } from "./types";

function App() {
  const [conta, setConta] = useState<ContaDTO | null>(null);
  const [contaError, setContaError] = useState("");
  useEffect(() => { contaService.atual().then(setConta).catch(() => setConta(null)); }, []);
  async function sair() {
    try { await contaService.sair(); setConta(null); setContaError(""); }
    catch { setContaError("Nao foi possivel sair. Tente novamente."); }
  }
  const [screen, setScreen] = useState<Screen>("landing");
  const [protocoloInicial, setProtocoloInicial] = useState<string | undefined>(undefined);

  if (screen === "cadastro" || screen === "login") {
    return <CidadaosPage modo={screen} onBack={() => setScreen("landing")}
      onModo={setScreen} onLogin={dados => { setConta(dados); setContaError(""); setScreen("landing"); }} />;
  }

  if (screen === "gestor") {
    return <GestorPage onBack={() => setScreen("landing")} />;
  }

  if (screen === "atendente") {
    return <FuncionarioPage onBack={() => setScreen("landing")} />;
  }

  if (screen === "cidadao") {
    return (
      <Dashboard
        onBack={() => setScreen("landing")}
        protocoloInicial={protocoloInicial}
        conta={conta}
      />
    );
  }

  return (
    <LandingPage
      conta={conta}
      contaError={contaError}
      onCadastro={() => setScreen("cadastro")}
      onLogin={() => setScreen("login")}
      onSair={sair}
      onCidadao={(protocolo) => {
        setProtocoloInicial(protocolo);
        setScreen("cidadao");
      }}
      onAtendente={() => setScreen("atendente")}
      onGestor={() => setScreen("gestor")}
    />
  );
}

export default App;
