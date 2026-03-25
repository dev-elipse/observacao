public class Cidadao extends Usuario{
    private String telefone;

    public Cidadao(int id, String nome, String email, boolean anonimo, String telefone) {
        if (nome == null || email == null || telefone == null){
            throw new IllegalArgumentException("os campos não podem ser nulos");
        }

        super(id, nome, email, anonimo);
        this.telefone = telefone;
    }

    public String getTelefone() {
        return telefone;
    }
}
