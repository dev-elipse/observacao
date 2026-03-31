import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Solicitacao {
    private static int contador = 0;
    private String protocolo;
    private String descricao;
    private String localizacao;
    private Prioridade prioridade;
    private StatusSolicitacao statusAtual;
    private Usuario usuario;
    private Categoria categoria;
    private List<HistoricoStatus> historico;

    public void adicionarHistorico(HistoricoStatus historicoStatus){
        historico.add(historicoStatus);
    }

    public void atualizarStatus(StatusSolicitacao novoStatus, String comentario, Usuario usuario){
        HistoricoStatus h = new HistoricoStatus(novoStatus, comentario, usuario);
        adicionarHistorico(h);
        statusAtual = novoStatus;
    }

    private String gerarProtocolo(){
        int ano = LocalDateTime.now().getYear();
        String numeroFormatado = String.format("%04d", contador);
        return "SOL" + ano + "-" + numeroFormatado;
    }

    public Solicitacao(Usuario usuario, Categoria categoria, String descricao, String localizacao, Prioridade prioridade) {
        contador++;
        this.protocolo = gerarProtocolo();
        this.usuario = usuario;
        this.categoria = categoria;
        this.descricao = descricao;
        this.localizacao = localizacao;
        this.prioridade = prioridade;
        this.statusAtual = StatusSolicitacao.ABERTO;
        this.historico = new ArrayList<>();
        HistoricoStatus h = new HistoricoStatus(statusAtual, "Solicitação aberta", null);
        adicionarHistorico(h);
    }

    public String getProtocolo() {
        return protocolo;
    }

    public Prioridade getPrioridade() {
        return prioridade;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public StatusSolicitacao getStatusAtual() {
        return statusAtual;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public String getDescricao() {
        return descricao;
    }

    public List<HistoricoStatus> getHistorico() {
        return historico;
    }
}
