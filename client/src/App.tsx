import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GestorPage from "./pages/GestorPage";
import FuncionarioPage from "./pages/FuncionarioPage";
import type { Screen } from "./types";

function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [protocoloInicial, setProtocoloInicial] = useState<string | undefined>(undefined);

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
      />
    );
  }

  return (
    <LandingPage
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
