import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SolicitacoesService {
    private FilaAtendimento fila;

    public SolicitacoesService() {
        this.fila = new FilaAtendimento();
    }

    public void criarSolicitacao(Usuario usuario, Categoria categoria, String descricao, String localizacao, Prioridade prioridade){
        Solicitacao s = new Solicitacao(descricao, localizacao, prioridade, usuario, categoria);
        fila.adicionarSolicitacao(s);
    }

    public void listarSolicitacoes(){
        List<Solicitacao> listaSolicitacoes = fila.getSolicitacoes();
        for (Solicitacao solicitacao : listaSolicitacoes){
                System.out.printf("║  %-22.22s  %-24.24s  %-15.15s ║\n", solicitacao.getProtocolo(), solicitacao.getCategoria(), solicitacao.getStatusAtual().statusFormatado());
                System.out.println("║--------------------------------------------------------------------║");
                imprimirTextoFormatado(solicitacao.getDescricao(), 66);
                System.out.println("║                                                                    ║");
                imprimirTextoFormatado("📍" + solicitacao.getLocalizacao(), 66);
                System.out.println("╚════════════════════════════════════════════════════════════════════╝");
            }
    }

    public Solicitacao buscarPorProtocolo(String protocolo){
        List<Solicitacao> lista = fila.getSolicitacoes();
        for (Solicitacao s : lista){
            if (s.getProtocolo().equals(protocolo)) {
                return s;
            }
        }
        return null;
    }

    public void atualizarStatus(String protocolo, StatusSolicitacao status, String comentario, Usuario usuario){
        Solicitacao s = buscarPorProtocolo(protocolo);
        s.atualizarStatus(status, comentario, usuario);
    }

    private static void imprimirTextoFormatado(String texto, int largura){
        String[] palavras = texto.split(" ");
        String linha = "";

        for(String palavra : palavras){
            if((linha + palavra).length() > largura){
                System.out.printf("║ %-" + largura + "s ║\n", linha);
                linha = palavra + " ";
            } else {
                linha += palavra + " ";
            }
        }

        if (!linha.isEmpty()) {
            System.out.printf("║ %-" + largura + "s ║\n", linha);
        }
    }
}
