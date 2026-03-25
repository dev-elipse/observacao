public class ServidorPublico extends Usuario{
    private String cargo;

    public ServidorPublico(int id, String nome, String email, boolean anonimo, String cargo) {
        if (nome == null || email == null || cargo == null){
            throw new IllegalArgumentException("os campos não podem ser nulos");
        }

        super(id, nome, email, anonimo);
        this.cargo = cargo;
    }

    public String getCargo() {
        return cargo;
    }
}
