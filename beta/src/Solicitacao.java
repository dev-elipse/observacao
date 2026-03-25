import java.sql.SQLOutput;
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
        System.out.println("DEBUG -- " + historicoStatus.getStatus() + " adicionado ao histórico");
    }

    public void atualizarStatus(StatusSolicitacao novoStatus, String comentario, ServidorPublico servidorPublico){
        HistoricoStatus h = new HistoricoStatus(novoStatus, comentario, servidorPublico);
        adicionarHistorico(h);
        statusAtual = novoStatus;
        System.out.println("DEBUG -- Status alterado para: " + statusAtual);
    }

    private String gerarProtocolo(){
        int ano = LocalDateTime.now().getYear();
        String numeroFormatado = String.format("%04d", contador);
        return "SOL" + ano + "-" + numeroFormatado;
    }

    public Solicitacao(String descricao, String localizacao, Prioridade prioridade, Usuario usuario, Categoria categoria) {
        contador++;
        this.protocolo = gerarProtocolo();
        this.descricao = descricao;
        this.localizacao = localizacao;
        this.prioridade = prioridade;
        this.statusAtual = StatusSolicitacao.ABERTO;
        this.usuario = usuario;
        this.categoria = categoria;
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
