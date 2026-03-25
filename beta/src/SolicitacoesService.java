import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SolicitacoesService {
    private FilaAtendimento fila;

    public void criarSolicitacao(Usuario usuario, Categoria categoria, String descricao, String localizacao, Prioridade prioridade){
        Solicitacao s = new Solicitacao(descricao, localizacao, prioridade, usuario, categoria);
        fila.adicionarSolicitacao(s);
        System.out.println("DEBUG -- Solicitação: " + s.getProtocolo() + "adicionada à fila");
    }

    public List<Solicitacao> listarSolicitacoes(){
        return fila.getSolicitacoes();
    }

    public Solicitacao buscarPorProtocolo(String protocolo){
        List<Solicitacao> lista = fila.getSolicitacoes();
        for (Solicitacao s : lista){
            if (s.getProtocolo().equals(protocolo)) {
                System.out.println("DEBUG -- Protocolo " + s.getProtocolo() + "encontrado");
                return s;
            }
        }
        System.out.println("DEBUG -- Protocolo " + protocolo + "não encontrado");
        return null;
    }

    public void atualizarStatus(String protocolo, StatusSolicitacao status, String comentario, ServidorPublico servidorPublico){
        Solicitacao s = buscarPorProtocolo(protocolo);
        s.atualizarStatus(status, comentario, servidorPublico);
        System.out.println("DEBUG -- Solicitação: " + s.getProtocolo() + "atualizou seu status para: " + s.getStatusAtual());
    }
}
