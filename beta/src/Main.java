import java.util.List;

public class Main {
    public static void main(String[] args) {

        Cidadao cid = new Cidadao(1, "Joao", "joao@gmail.com", false, "44999122752");
        ServidorPublico ser = new ServidorPublico(1, "Carlos", "carlos@gmail.com", false, "Analista de Urbanismo");
        Categoria cat = new Categoria("1", "Urbanização");
        Solicitacao sol = new Solicitacao("A luz do poste está com defeito, não está iluminando, deixando a rua totalmente escura", "Rua Pirapora, 574, Zona 2 - Cianorte-PR", Prioridade.ALTA, cid, cat);
        System.out.println("DEBUG -- Status Atual: " + sol.getStatusAtual());
        System.out.println("DEBUG -- Protocolo: " + sol.getProtocolo());
        System.out.println("DEBUG -- Categoria: " + sol.getCategoria());
        System.out.println("DEBUG -- Prioridade: " + sol.getPrioridade());
        System.out.println("DEBUG -- Localização: " + sol.getLocalizacao());
        System.out.println("DEBUG -- Descrição: " + sol.getDescricao());

        for(HistoricoStatus h : sol.getHistorico()){
            System.out.println("\nDEBUG -- Histórico Status: " + h.getStatus());
            System.out.println("DEBUG -- Histórico Comentário: " + h.getComentario());
            System.out.println("DEBUG -- Histórico Data/Hora: " + h.getDataHora());
            System.out.println("DEBUG -- Histórico Responsavel: " + h.getResponsavel());
        }

        sol.atualizarStatus(StatusSolicitacao.EM_EXECUCAO, "Solicitação em atendimento", ser);
        System.out.println("DEBUG -- Status Atual: " + sol.getStatusAtual());

        for(HistoricoStatus h : sol.getHistorico()){
            System.out.println("\nDEBUG -- Histórico Status: " + h.getStatus());
            System.out.println("DEBUG -- Histórico Comentário: " + h.getComentario());
            System.out.println("DEBUG -- Histórico Data/Hora: " + h.getDataHora());
            System.out.println("DEBUG -- Histórico Responsavel: " + h.getResponsavel());
        }

    }
}
