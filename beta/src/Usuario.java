abstract class Usuario {
    private int id;
    private String nome;
    private String email;
    private boolean anonimo;

    public Usuario(int id, String nome, String email, boolean anonimo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.anonimo = anonimo;
    }

    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public boolean isAnonimo() {
        return anonimo;
    }
}