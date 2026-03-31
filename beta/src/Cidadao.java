public class Cidadao extends Usuario{
    private String telefone;

    public Cidadao(String nome, String email, String telefone) {

        super(nome, email, false);
        this.telefone = telefone;
    }

    public String getTelefone() {
        return telefone;
    }
}
