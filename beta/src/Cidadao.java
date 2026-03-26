public class Cidadao extends Usuario{
    private String telefone;
    private Boolean isAnonimo;

    public Cidadao(String nome, String email, Boolean isAnonimo, String telefone) {
        if (nome == null || email == null || isAnonimo == null|| telefone == null){
            throw new IllegalArgumentException("os campos não podem ser nulos");
        }

        super(nome, email, false);
        this.telefone = telefone;
        this.isAnonimo = isAnonimo;
    }

    public String getTelefone() {
        return telefone;
    }

    public Boolean getIsAnonimo() {
        return isAnonimo;
    }
}
