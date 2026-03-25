import java.time.LocalDateTime;

public class HistoricoStatus {
    private StatusSolicitacao status;
    private LocalDateTime dataHora  = LocalDateTime.now();
    private String comentario;
    private ServidorPublico responsavel;

    public HistoricoStatus(StatusSolicitacao status, String comentario, ServidorPublico responsavel) {
        if (status == null || comentario == null){
            throw new IllegalArgumentException("os campos não podem ser nulos");
        }
        this.status = status;
        this.comentario = comentario;
        this.responsavel = responsavel;
    }

    public StatusSolicitacao getStatus() {
        return status;
    }

    public String getComentario() {
        return comentario;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public ServidorPublico getResponsavel() {
        return responsavel;
    }
}
