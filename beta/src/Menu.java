import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Menu {

    private final List<Usuario> usuarios = new ArrayList<>();
    private final Scanner sc = new Scanner(System.in);
    private final SolicitacoesService s;

    public Menu(SolicitacoesService s){
        this.s = s;
    }

    private void imprimirTitulo(String titulo, String tamanho) {
        switch (tamanho) {
            case "S":
                System.out.println("\n╔══════════════════════════════════════════════╗");
                System.out.printf("║ %-44s ║\n", titulo);
                System.out.println("╚══════════════════════════════════════════════╝");
                break;
            case "L":
                System.out.println("\n╔════════════════════════════════════════════════════════════════════╗");
                System.out.printf("║ %-66s ║\n", titulo);
                System.out.println("╚════════════════════════════════════════════════════════════════════╝");
                break;
            default:
                System.out.println(titulo);
                break;
        }
    }

    private <T extends Enum<T>> T escolherEnum(T[] valores) {
        for (int i = 0; i < valores.length; i++) {
            System.out.printf("║  %d → %-61s ║\n", i + 1, valores[i].name().replace("_", " "));
        }
        System.out.println("╚════════════════════════════════════════════════════════════════════╝");
        System.out.print("➤ Escolha: ");
        int escolha = lerInteiro();

        if (escolha >= 1 && escolha <= valores.length) {
            return valores[escolha - 1];
        } else {
            System.out.println("\n❌ Opção inválida!");
            return null;
        }
    }

    private void pausar(){
        System.out.println("⚠️ Pressione ENTER para continuar!");
        sc.nextLine();
    }

    private int lerInteiro() {
        while (true) {
            try {
                return Integer.parseInt(sc.nextLine());
            } catch (NumberFormatException e) {
                System.out.print("❌ Entrada inválida. Digite um número: ");
            }
        }
    }

    private void imprimirLista(List<Solicitacao> solicitacoes){
        if (solicitacoes.isEmpty()) {
            System.out.println("\n❌ Nenhuma solicitação encontrada!");
            return;
        }
        System.out.println(" ");
        for (Solicitacao solicitacao : solicitacoes){
            System.out.println("╔════════════════════════════════════════════════════════════════════╗");
            System.out.printf("║    %-12.12s ┃ %-21.21s ┃ %-14.14s ┃ %-5.5s   ║\n", solicitacao.getProtocolo(), solicitacao.getCategoria(), solicitacao.getStatusAtual().statusFormatado(), solicitacao.getPrioridade());
            System.out.println("║────────────────────────────────────────────────────────────────────║");
            imprimirTextoFormatado(solicitacao.getDescricao(), 66);
            System.out.println("║────────────────────────────────────────────────────────────────────║");
            imprimirTextoFormatado("📍 " + solicitacao.getLocalizacao(), 66);
            System.out.println("╚════════════════════════════════════════════════════════════════════╝");
        }
    }

    private void imprimirSolicitacao(Solicitacao solicitacao){
        System.out.println("╔════════════════════════════════════════════════════════════════════╗");
        System.out.printf("║    %-12.12s ┃ %-21.21s ┃ %-14.14s ┃ %-5.5s   ║\n", solicitacao.getProtocolo(), solicitacao.getCategoria(), solicitacao.getStatusAtual().statusFormatado(), solicitacao.getPrioridade());
        System.out.println("║────────────────────────────────────────────────────────────────────║");
        imprimirTextoFormatado(solicitacao.getDescricao(), 66);
        System.out.println("║────────────────────────────────────────────────────────────────────║");
        imprimirTextoFormatado("📍" + solicitacao.getLocalizacao(), 66);
        System.out.println("╚════════════════════════════════════════════════════════════════════╝");
    }

    private static void imprimirTextoFormatado(String texto, int largura){
        String[] palavras = texto.split(" ");
        String linha = "";

        for(String palavra : palavras){
            if((linha + palavra).length() > largura){
                System.out.printf("║ %-" + largura + "s ║\n", linha);
                linha = palavra + " ";
            } else {
                linha += palavra + " ";
            }
        }

        if (!linha.isEmpty()) {
            System.out.printf("║ %-" + largura + "s ║\n", linha);
        }
    }

    public void iniciar() {
        while(true) {
            System.out.println("\n╔══════════════════════════════════════════════╗");
            System.out.println("║                 ObservAção                   ║");
            System.out.println("╠══════════════════════════════════════════════╣");
            System.out.println("║ 1 → Cadastro                                 ║");
            System.out.println("║ 2 → Login                                    ║");
            System.out.println("║ 0 → Sair                                     ║");
            System.out.println("╚══════════════════════════════════════════════╝");
            System.out.print("➤ Escolha uma opção: ");
            int escolha = lerInteiro();

            switch (escolha) {
                case 1 -> cadastrarUsuario();
                case 2 -> login();
                case 0 -> {
                    System.out.println("\nSaindo do sistema...");
                    return;
                }
                default -> System.out.println("\nOpção inválida");
            }
        }
    }

    private void cadastrarUsuario() {
        imprimirTitulo("Cadastro de Usuário", "S");

        System.out.println("\n╔══════════════════════════════════════════════╗");
        System.out.println("║               Tipo de Usuário                ║");
        System.out.println("╠══════════════════════════════════════════════╣");
        System.out.println("║ 1 → Cidadão                                  ║");
        System.out.println("║ 2 → Servidor Público                         ║");
        System.out.println("║ 3 → Cidadão Anônimo                          ║");
        System.out.println("╚══════════════════════════════════════════════╝");
        System.out.print("➤ Escolha: ");
        int escolha = lerInteiro();

        switch (escolha) {
            case 1:
            case 2: {
                System.out.print("➤ Nome: ");
                String nome = sc.nextLine();

                System.out.print("➤ E-mail: ");
                String email = sc.nextLine();

                Usuario usuario;

                if (escolha == 1) {
                    System.out.print("➤ Telefone: ");
                    String telefone = sc.nextLine();
                    usuario = new Cidadao(nome, email, telefone);
                } else {
                    System.out.print("➤ Cargo: ");
                    String cargo = sc.nextLine();
                    usuario = new ServidorPublico(nome, email, cargo);
                }

                usuarios.add(usuario);
                System.out.println("\n✅ Cadastro realizado com sucesso!");
                break;
            }

            case 3:
                menuAnonimo();
                break;

            default:
                System.out.println("\n❌ Tipo de usuário inválido!");
                break;

        }
    }

    private void login() {
        imprimirTitulo("Login de Usuário", "S");

        System.out.print("➤ E-mail: ");
        String email = sc.nextLine();

        Usuario usuario = usuarios.stream().filter(u -> email.equals(u.getEmail())).findFirst().orElse(null);

        if (usuario == null) {
            System.out.println("\n❌ E-mail não encontrado!");
            return;
        }

        System.out.println("\n╔══════════════════════════════════════════════╗");
        System.out.println("║                 Bem-vindo(a)!                ║");
        System.out.println("╠══════════════════════════════════════════════╣");
        System.out.printf("║    Olá, %-36s ║\n", usuario.getNome());
        System.out.println("╚══════════════════════════════════════════════╝");

        if (usuario.getAdmin()) {
            menuServidorPublico(usuario);
        } else {
            menuCidadao(usuario);
        }
    }

    private void menuAnonimo() {
        System.out.println("\n╔══════════════════════════════════════════════╗");
        System.out.println("║                 Menu Anônimo                 ║");
        System.out.println("╠══════════════════════════════════════════════╣");
        System.out.println("║ 1 → Abrir uma Solicitação                    ║");
        System.out.println("║ 2 → Buscar por Protocolo                     ║");
        System.out.println("║ 0 → Sair                                     ║");
        System.out.println("╚══════════════════════════════════════════════╝");
        System.out.print("➤ Escolha: ");
        int escolha = lerInteiro();

        Usuario anonimo = new Cidadao("Usuário Anônimo", "Nenhum e-mail cadastrado", "Nenhum telefone cadastrado");

        switch (escolha) {
            case 1:
                imprimirTitulo("Abertura de Solicitação", "L");

                imprimirTitulo("Categoria", "L");
                Categoria[] categorias = Categoria.values();
                Categoria categoria = escolherEnum(categorias);

                System.out.print("➤ Descrição da Solicitação: ");
                String descricao = sc.nextLine();

                System.out.print("➤ Localização: ");
                String localizacao = sc.nextLine();

                imprimirTitulo("Prioridade", "L");
                Prioridade[] prioridades = Prioridade.values();
                Prioridade prioridade = escolherEnum(prioridades);

                s.criarSolicitacao(anonimo, categoria, descricao, localizacao, prioridade);
                System.out.println("\n✅ Solicitação criada!");
                break;
            case 2:
                imprimirTitulo("Buscar Solicitação", "L");

                System.out.print("➤ Protocolo: ");
                String protocolo = sc.nextLine();

                Solicitacao solicitacao = s.buscarPorProtocolo(protocolo);
                imprimirSolicitacao(solicitacao);

                pausar();
                break;
            case 0:
                System.out.println("\nSaindo do sistema...");
                return;
            default:
                System.out.println("\nOpção inválida");
        }


    }

    private void menuServidorPublico(Usuario usuario) {
        while (true) {
            System.out.println("\n╔══════════════════════════════════════════════╗");
            System.out.println("║             Menu Servidor Público            ║");
            System.out.println("╠══════════════════════════════════════════════╣");
            System.out.println("║ 1 → Listar Solicitações                      ║");
            System.out.println("║ 2 → Listar por Prioridade                    ║");
            System.out.println("║ 3 → Listar por Status                        ║");
            System.out.println("║ 4 → Listar por Categoria                     ║");
            System.out.println("║ 5 → Buscar por Protocolo                     ║");
            System.out.println("║ 6 → Atualizar Status                         ║");
            System.out.println("║ 0 → Sair                                     ║");
            System.out.println("╚══════════════════════════════════════════════╝");
            System.out.print("➤ Escolha: ");
            int escolha = lerInteiro();

            switch (escolha) {
                case 1:
                    imprimirTitulo("Lista de Solicitações", "L");

                    List<Solicitacao> lista = s.listarSolicitacoes();
                    imprimirLista(lista);

                    pausar();
                    break;
                case 2:
                    imprimirTitulo("Lista de Solicitações por Prioridade", "L");

                    List<Solicitacao> listaPrioridade = s.listarPorPrioridade();
                    imprimirLista(listaPrioridade);

                    pausar();
                    break;
                case 3:
                    imprimirTitulo("Lista de Solicitações por Status", "L");

                    List<Solicitacao> listaStatus = s.listarPorStatus();
                    imprimirLista(listaStatus);

                    pausar();
                    break;
                case 4:
                    imprimirTitulo("Lista de Solicitações por Categoria", "L");

                    List<Solicitacao> listaCategoria = s.listarPorCategoria();
                    imprimirLista(listaCategoria);

                    pausar();
                    break;
                case 5:
                    imprimirTitulo("Buscar Solicitações", "L");

                    System.out.print("➤ Protocolo: ");
                    String protocolo = sc.nextLine();

                    try {
                        Solicitacao solicitacao = s.buscarPorProtocolo(protocolo);
                        imprimirSolicitacao(solicitacao);
                    } catch (Exception e) {
                        System.out.println("\n❌ " + e.getMessage());
                    }


                    pausar();
                    break;
                case 6:
                    imprimirTitulo("Atualizar Status", "S");

                    System.out.print("➤ Protocolo: ");
                    String protocol = sc.nextLine();

                    System.out.println("\n╔══════════════════════════════════════════════╗");
                    System.out.println("║                    Status                    ║");
                    System.out.println("╠══════════════════════════════════════════════╣");
                    System.out.println("║ 1 → Aberto                                   ║");
                    System.out.println("║ 2 → Triagem                                  ║");
                    System.out.println("║ 3 → Em Execução                              ║");
                    System.out.println("║ 4 → Resolvido                                ║");
                    System.out.println("║ 5 → Encerrado                                ║");
                    System.out.println("║ 0 → Sair                                     ║");
                    System.out.println("╚══════════════════════════════════════════════╝");
                    System.out.print("➤ Escolha: ");
                    int status = lerInteiro();

                    System.out.print("➤ Comentário: ");
                    String comentario = sc.nextLine();

                    StatusSolicitacao statusSolicitacao = StatusSolicitacao.fromCodigo(status);
                    s.atualizarStatus(protocol, statusSolicitacao, comentario, usuario);

                    pausar();
                    break;
                case 0:
                    System.out.println("\nSaindo do sistema...");
                    return;
                default:
                    System.out.println("\nOpção inválida");
            }

        }
    }

    private void menuCidadao(Usuario cidadao) {
        while (true) {
            System.out.println("\n╔══════════════════════════════════════════════╗");
            System.out.println("║                 Menu Cidadão                 ║");
            System.out.println("╠══════════════════════════════════════════════╣");
            System.out.println("║ 1 → Abrir uma Solicitação                    ║");
            System.out.println("║ 2 → Minhas Solicitações                      ║");
            System.out.println("║ 3 → Buscar por Protocolo                     ║");
            System.out.println("║ 0 → Sair                                     ║");
            System.out.println("╚══════════════════════════════════════════════╝");
            System.out.print("➤ Escolha: ");
            int escolha = lerInteiro();

            switch (escolha) {
                case 1:
                    imprimirTitulo("Abertura de Solicitação", "L");

                    imprimirTitulo("Categoria", "L");
                    Categoria[] categorias = Categoria.values();
                    Categoria categoria = escolherEnum(categorias);

                    System.out.print("➤ Descrição da Solicitação: ");
                    String descricao = sc.nextLine();

                    System.out.print("➤ Localização: ");
                    String localizacao = sc.nextLine();

                    imprimirTitulo("Prioridade", "L");
                    Prioridade[] prioridades = Prioridade.values();
                    Prioridade prioridade = escolherEnum(prioridades);

                    s.criarSolicitacao(cidadao, categoria, descricao, localizacao, prioridade);
                    System.out.println("\n✅ Solicitação criada!");
                    break;
                case 2:
                    imprimirTitulo("Lista de Solicitações", "L");
                    List<Solicitacao> lista = s.listarSolicitacoes();
                    imprimirLista(lista);

                    pausar();
                    break;
                case 3:
                    imprimirTitulo("Buscar Solicitação", "L");

                    System.out.print("➤ Protocolo: ");
                    String protocolo = sc.nextLine();

                    Solicitacao solicitacao = s.buscarPorProtocolo(protocolo);
                    imprimirSolicitacao(solicitacao);

                    pausar();
                    break;
                case 0:
                    System.out.println("\nSaindo do sistema...");
                    return;
                default:
                    System.out.println("\nOpção inválida");
            }

        }
    }
}