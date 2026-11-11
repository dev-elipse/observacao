import { useEffect, useRef, useState } from "react";
import { cidadaoService } from "../services/api";
import type { CidadaoPerfilDTO } from "../services/api";

export default function SolicitanteResumo({ cidadaoId }: { cidadaoId?: string | null }) {
  const [perfil, setPerfil] = useState<CidadaoPerfilDTO | null>(null);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let ativo = true;
    setPerfil(null);
    setErro(false);
    if (cidadaoId) {
      cidadaoService.getById(cidadaoId).then(dados => {
        if (ativo) setPerfil(dados);
      }).catch(() => { if (ativo) setErro(true); });
    }
    return () => { ativo = false; };
  }, [cidadaoId, tentativa]);

  const cpf = perfil?.cpf?.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4") || "Não informado";

  return <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
    <h3 className="font-semibold text-[#0F2A4A] mb-2">Solicitante</h3>
    {!cidadaoId ? <p className="text-slate-500">Ocorrência sem identificação.</p>
      : erro ? <div role="alert">
        <p>Não foi possível carregar o perfil do solicitante.</p>
        <button type="button" onClick={() => setTentativa(t => t + 1)} className="text-[#2E7BD4] font-semibold mt-2">Tentar novamente</button>
      </div>
      : !perfil ? <p role="status">Carregando solicitante...</p>
      : <>
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div><p className="font-semibold break-words">{perfil.nome}</p><p className="text-slate-500">CPF: {cpf}</p></div>
          <button type="button" onClick={() => dialog.current?.showModal()} className="font-semibold text-[#2E7BD4] hover:underline">Ver perfil completo</button>
        </div>
        <dialog ref={dialog} aria-labelledby="perfil-titulo" className="m-auto w-[calc(100%_-_2rem)] max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-6 shadow-2xl backdrop:bg-black/50">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 id="perfil-titulo" className="text-xl font-bold text-[#0F2A4A]">Perfil do cidadão</h2>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Fechar perfil" className="text-slate-500 p-2"><i className="ti ti-x" aria-hidden="true" /></button>
          </div>
          <dl className="space-y-3 text-sm break-words">
            <div><dt className="font-semibold">Nome completo</dt><dd>{perfil.nome}</dd></div>
            <div><dt className="font-semibold">CPF</dt><dd>{cpf}</dd></div>
            <div><dt className="font-semibold">E-mail</dt><dd>{perfil.email}</dd></div>
            <div><dt className="font-semibold">Telefone</dt><dd>{perfil.telefone || "Não informado"}</dd></div>
            <div><dt className="font-semibold">Endereços cadastrados</dt><dd>
              {perfil.enderecos?.length ? <ul className="space-y-2 mt-1">{perfil.enderecos.map((endereco, index) => <li key={index}>
                {endereco.rua}, {endereco.numero} — {endereco.bairro}, {endereco.cidade}/{endereco.estado}
              </li>)}</ul> : "Nenhum endereço cadastrado."}
            </dd></div>
          </dl>
          <button type="button" onClick={() => dialog.current?.close()} className="mt-6 px-4 py-2 rounded-xl bg-[#0F2A4A] text-white font-semibold text-sm">Voltar à ocorrência</button>
        </dialog>
      </>}
  </section>;
}
