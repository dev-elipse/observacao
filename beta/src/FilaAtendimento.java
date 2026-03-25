import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class FilaAtendimento {
    private List<Solicitacao> solicitacoes;

    public FilaAtendimento(List<Solicitacao> solicitacoes) {
        this.solicitacoes = solicitacoes;
    }

    public void adicionarSolicitacao(Solicitacao solicitacao){
        for (Solicitacao s : solicitacoes) {
            if (solicitacao.getProtocolo().equals(s.getProtocolo())) {
                System.out.println("Já existe uma solicitação o protocolo: " + solicitacao.getProtocolo());
                return;
            }
        }
        solicitacoes.add(solicitacao);
    }

    public List<Solicitacao> listarPorPrioridade(){
        List<Solicitacao> solicitacoesPorPrioridade = new ArrayList<>(solicitacoes);
        solicitacoesPorPrioridade.sort(Comparator.comparing(Solicitacao::getPrioridade));
        return solicitacoesPorPrioridade;
    }

    public List<Solicitacao> listarPorCategoria(){
        List<Solicitacao> solicitacoesPorCategoria = new ArrayList<>(solicitacoes);
        solicitacoesPorCategoria.sort(Comparator.comparing(s -> s.getCategoria().getNome()));
        return solicitacoesPorCategoria;
    }

    public List<Solicitacao> getSolicitacoes() {
        return solicitacoes;
    }
}
