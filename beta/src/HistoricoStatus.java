import java.time.LocalDateTime;

public class HistoricoStatus {
    private StatusSolicitacao status;
    private LocalDateTime dataHora  = LocalDateTime.now();
    private String comentario;
    private Usuario responsavel;

    public HistoricoStatus(StatusSolicitacao status, String comentario, Usuario responsavel) {
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

    public Usuario getResponsavel() {
        return responsavel;
    }
}
