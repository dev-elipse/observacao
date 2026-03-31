import java.util.List;

public class SolicitacoesService {
    private FilaAtendimento fila;

    public SolicitacoesService() {
        this.fila = new FilaAtendimento();
    }

    public Solicitacao criarSolicitacao(Usuario usuario, Categoria categoria, String descricao, String localizacao, Prioridade prioridade){
        if (usuario == null) {
            throw new IllegalArgumentException("Usuário não pode ser nulo");
        }
        if (categoria == null) {
            throw new IllegalArgumentException("Categoria não pode ser nula");
        }
        if (prioridade == null) {
            throw new IllegalArgumentException("Prioridade não pode ser nula");
        }
        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória");
        }
        if (localizacao == null || localizacao.isBlank()) {
            throw new IllegalArgumentException("Localização é obrigatória");
        }

        Solicitacao s = new Solicitacao(
                usuario,
                categoria,
                localizacao.trim(),
                descricao.trim(),
                prioridade
        );

        fila.adicionarSolicitacao(s);
        return s;
    }

    public List<Solicitacao> listarSolicitacoes(){
        return fila.getSolicitacoes();
    }

    public List<Solicitacao> listarPorPrioridade(){
        return fila.listarPorPrioridade();
    }

    public List<Solicitacao> listarPorCategoria(){
        return fila.listarPorCategoria();
    }

    public List<Solicitacao> listarPorStatus(){
        return fila.listarPorStatus();
    }

    public Solicitacao buscarPorProtocolo(String protocolo){
        if (protocolo == null || protocolo.isBlank()){
            throw new IllegalArgumentException("Protocolo inválido");
        }

        return fila.getSolicitacoes().stream()
                .filter(s -> protocolo.equals(s.getProtocolo()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));
    }

    public void atualizarStatus(String protocolo, StatusSolicitacao status, String comentario, Usuario usuario){
        if (protocolo == null) {
            throw new IllegalArgumentException("Protocolo não pode ser nulo");
        }
        if (status == null) {
            throw new IllegalArgumentException("Status não pode ser nulo");
        }
        if (comentario == null || comentario.isBlank()) {
            throw new IllegalArgumentException("Comentário é obrigatório");
        }
        if (usuario == null) {
            throw new IllegalArgumentException("Servidor Público não pode ser nulo");
        }

        Solicitacao s = buscarPorProtocolo(protocolo);
        s.atualizarStatus(status, comentario, usuario);
    }
}
