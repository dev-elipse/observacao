abstract class Usuario {
    private String nome;
    private String email;
    private Boolean isAdmin;

    public Usuario(String nome, String email, Boolean isAdmin) {
        this.nome = nome;
        this.email = email;
        this.isAdmin = isAdmin;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public Boolean getAdmin() {
        return isAdmin;
    }
}