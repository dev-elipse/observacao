public class ServidorPublico extends Usuario{
    private String cargo;

    public ServidorPublico(String nome, String email, String cargo) {
        if (nome == null || email == null || cargo == null) {
            throw new IllegalArgumentException("os campos não podem ser nulos");
        }

        super(nome, email, true);
        this.cargo = cargo;
    }

    public String getCargo() {
        return cargo;
    }
}
