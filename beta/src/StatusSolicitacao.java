public enum StatusSolicitacao {
    ABERTO(1,"Aberto", "🔴"),
    TRIAGEM(2, "Triagem", "🟠"),
    EM_EXECUCAO(3, "Em Execução", "🟡"),
    RESOLVIDO(4, "Resolvido", "🟢"),
    ENCERRADO(5, "Encerrado", "⚫");

    private final int codigo;
    private final String label;
    private final String icone;

    StatusSolicitacao(int codigo, String label, String icone) {
        this.codigo = codigo;
        this.label = label;
        this.icone = icone;
    }

    public int getCodigo() {
        return codigo;
    }

    public String getLabel() {
        return label;
    }

    public String getIcone() {
        return icone;
    }

    public String statusFormatado(){
        return icone + " " + label;
    }

    public static StatusSolicitacao fromCodigo(int codigo) {
        for (StatusSolicitacao status : StatusSolicitacao.values()) {
            if (status.getCodigo() == codigo) {
                return status;
            }
        }
        throw new IllegalArgumentException("Código inválido para StatusSolicitacao: " + codigo);
    }
}
