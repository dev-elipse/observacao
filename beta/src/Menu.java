import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Menu {

    private List<Usuario> usuarios = new ArrayList<>();
    private Scanner sc = new Scanner(System.in);
    SolicitacoesService s = new SolicitacoesService();

    public void iniciar() {
        while(true) {
            System.out.println("\n╔════════════════════════════╗");
            System.out.println("║        ObservAção          ║");
            System.out.println("╠════════════════════════════╣");
            System.out.println("║ 1 → Cadastro               ║");
            System.out.println("║ 2 → Login                  ║");
            System.out.println("║ 0 → Sair                   ║");
            System.out.println("╚════════════════════════════╝");
            System.out.print("➤ Escolha uma opção: ");
            String escolha = sc.nextLine();

            switch (escolha) {
                case "1" -> cadastrarUsuario();
                case "2" -> login();
                case "0" -> {
                    System.out.println("\nSaindo do sistema...");
                    return;
                }
                default -> System.out.println("\nOpção inválida");
            }
        }
    }

    private void cadastrarUsuario() {
        System.out.println("\n╔════════════════════════════╗");
        System.out.println("║     Cadastro de Usuário    ║");
        System.out.println("╚════════════════════════════╝");

        System.out.print("➤ Nome: ");
        String nome = sc.nextLine();

        System.out.print("➤ E-mail: ");
        String email = sc.nextLine();

        System.out.println("\n╔════════════════════════════╗");
        System.out.println("║     Tipo de Usuário        ║");
        System.out.println("╠════════════════════════════╣");
        System.out.println("║ 1 → Cidadão                ║");
        System.out.println("║ 2 → Servidor Público       ║");
        System.out.println("╚════════════════════════════╝");
        System.out.print("➤ Escolha: ");
        int tipoUsuario = sc.nextInt();
        sc.nextLine();

        switch (tipoUsuario) {
            case 1:
                System.out.println("\n╔════════════════════════════╗");
                System.out.println("║     Opções do Cidadão      ║");
                System.out.println("╠════════════════════════════╣");
                System.out.println("║ 1 → Anônimo                ║");
                System.out.println("║ 2 → Identificado           ║");
                System.out.println("╚════════════════════════════╝");
                System.out.print("➤ Escolha: ");
                int anonimo = sc.nextInt();
                sc.nextLine();

                boolean isAnonimo = false;

                switch (anonimo) {
                    case 1 -> isAnonimo = true;
                    case 2 -> isAnonimo = false;
                    default -> {
                        System.out.println("\n❌ Opção inválida!");
                        return;
                    }
                }

                System.out.print("➤ Telefone: ");
                String telefone = sc.nextLine();

                Usuario cidadao = new Cidadao(nome, email, isAnonimo, telefone);
                usuarios.add(cidadao);

                System.out.println("\n✅ Cadastro realizado com sucesso!");
                break;

            case 2:
                System.out.print("\n➤ Cargo: ");
                String cargo = sc.nextLine();

                Usuario servidorPublico = new ServidorPublico(nome, email, cargo);
                usuarios.add(servidorPublico);

                System.out.println("\n✅ Cadastro realizado com sucesso!");
                break;

            default:
                System.out.println("\n❌ Tipo de usuário inválido!");
        }
    }

    private void login() {
        System.out.println("\n╔════════════════════════════╗");
        System.out.println("║      Login de Usuário      ║");
        System.out.println("╚════════════════════════════╝");

        System.out.print("➤ E-mail: ");
        String email = sc.nextLine();

        Usuario usuario = usuarios.stream().filter(u -> u.getEmail().equals(email)).findFirst().orElse(null);

        if (usuario == null) {
            System.out.println("\n❌ E-mail não encontrado!");
            return;
        }

        System.out.println("\n╔════════════════════════════╗");
        System.out.println("║        Bem-vindo(a)!       ║");
        System.out.println("╠════════════════════════════╣");
        System.out.printf("║    Olá, %-19s ║\n", usuario.getNome());
        System.out.println("╚════════════════════════════╝");

        if (usuario.getAdmin()) {
            menuServidorPublico(usuario);
        } else {
            menuCidadao(usuario);
        }
    }

    private void menuServidorPublico(Usuario usuario) {
        while (true) {
            System.out.println("\n╔════════════════════════════╗");
            System.out.println("║    Menu Servidor Público   ║");
            System.out.println("╠════════════════════════════╣");
            System.out.println("║ 1 → Listar Solicitações    ║");
            System.out.println("║ 2 → Buscar por Protocolo   ║");
            System.out.println("║ 3 → Atualizar Status       ║");
            System.out.println("║ 0 → Sair                   ║");
            System.out.println("╚════════════════════════════╝");
            System.out.print("➤ Escolha: ");
            int escolhaServidor = sc.nextInt();
            sc.nextLine();

            switch (escolhaServidor) {
                case 1:
                    System.out.println("\n╔════════════════════════════════════════════════════════════════════╗");
                    System.out.println("║                       Lista de Solicitações                        ║");
                    System.out.println("╠════════════════════════════════════════════════════════════════════╣");

                    s.listarSolicitacoes();

                    System.out.println("\n✅ Solicitações listadas com sucesso!");
                    System.out.println("\n⚠️ Pressione ENTER para continuar!");
                    sc.nextLine();
                    break;
                case 2:
                    System.out.println("\n╔════════════════════════════════════════════════════════════════════╗");
                    System.out.println("║                        Buscar Solicitações                         ║");
                    System.out.println("╚════════════════════════════════════════════════════════════════════╝");
                    System.out.print("➤ Protocolo: ");
                    String protocolo = sc.nextLine();

                    s.buscarPorProtocolo(protocolo);

                    System.out.println("\n✅ Solicitação buscada com sucesso!");
                    System.out.println("\n⚠️ Pressione ENTER para continuar!");
                    sc.nextLine();
                    break;
                case 3:
                    System.out.println("\n╔════════════════════════════════════════════════════════════════════╗");
                    System.out.println("║                          Atualizar Status                          ║");
                    System.out.println("╚════════════════════════════════════════════════════════════════════╝");
                    System.out.print("➤ Protocolo: ");
                    String protocol = sc.nextLine();

                    System.out.println("\n╔════════════════════════════╗");
                    System.out.println("║           Status           ║");
                    System.out.println("╠════════════════════════════╣");
                    System.out.println("║ 1 → Aberto                 ║");
                    System.out.println("║ 2 → Triagem                ║");
                    System.out.println("║ 3 → Em Execução            ║");
                    System.out.println("║ 4 → Resolvido              ║");
                    System.out.println("║ 5 → Encerrado              ║");
                    System.out.println("║ 0 → Sair                   ║");
                    System.out.println("╚════════════════════════════╝");
                    System.out.print("➤ Escolha: ");
                    int status = sc.nextInt();

                    System.out.print("➤ Comentário: ");
                    String comentario = sc.nextLine();

                    StatusSolicitacao statusSolicitacao = StatusSolicitacao.fromCodigo(status);
                    s.atualizarStatus(protocol, statusSolicitacao, comentario, usuario);

                    System.out.println("\n✅ Status atualizado com sucesso!");
                    System.out.println("\n⚠️ Pressione ENTER para continuar!");
                    sc.nextLine();
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
            System.out.println("\n╔════════════════════════════╗");
            System.out.println("║        Menu Cidadão        ║");
            System.out.println("╠════════════════════════════╣");
            System.out.println("║ 1 → Abrir uma Solicitação  ║");
            System.out.println("║ 2 → Minhas Solicitações    ║");
            System.out.println("║ 0 → Sair                   ║");
            System.out.println("╚════════════════════════════╝");
            System.out.print("➤ Escolha: ");
            int escolhaCidadao = sc.nextInt();
            sc.nextLine();

            switch (escolhaCidadao) {
                case 1:
                    System.out.println("\n╔════════════════════════════╗");
                    System.out.println("║    Abrir uma Solicitação   ║");
                    System.out.println("╚════════════════════════════╝");

                    System.out.println("\n╔════════════════════════════════════════════════╗");
                    System.out.println("║                    Categoria                   ║");
                    System.out.println("╠════════════════════════════════════════════════╣");

                    Categoria[] categorias = Categoria.values();

                    for (int i = 0; i < categorias.length; i++) {
                        System.out.printf("║  %d → %-40s ║\n", i + 1, categorias[i].name().replace("_", " "));
                    }
                    System.out.println("╚════════════════════════════════════════════════╝");
                    System.out.print("➤ Escolha: ");
                    int escolhaCategoria = sc.nextInt();
                    sc.nextLine();

                    Categoria categoria = null;
                    if (escolhaCategoria >= 1 && escolhaCategoria <= categorias.length) {
                        categoria = categorias[escolhaCategoria - 1];
                    } else {
                        System.out.println("\n❌ Opção inválida!");
                    }

                    System.out.print("➤ Descrição da Solicitação: ");
                    String descricao = sc.nextLine();

                    System.out.print("➤ Localização: ");
                    String localizacao = sc.nextLine();

                    System.out.println("\n╔════════════════════════════╗");
                    System.out.println("║         Prioridade         ║");
                    System.out.println("╠════════════════════════════╣");

                    Prioridade[] prioridades = Prioridade.values();

                    for (int i = 0; i < prioridades.length; i++) {
                        System.out.printf("║  %d → %-21s ║\n", i + 1, prioridades[i].name().replace("_", " "));
                    }
                    System.out.println("╚════════════════════════════╝");
                    System.out.print("➤ Escolha: ");
                    int escolhaPrioridade = Integer.parseInt(sc.nextLine());

                    Prioridade prioridade = null;
                    if (escolhaPrioridade >= 1 && escolhaPrioridade <= prioridades.length) {
                        prioridade = prioridades[escolhaPrioridade - 1];
                    } else {
                        System.out.println("\n❌ Opção inválida!");
                    }

                    s.criarSolicitacao(cidadao, categoria, descricao, localizacao, prioridade);

                    System.out.println("\n✅ Solicitação criada com sucesso!");
                    System.out.println("⚠️ Pressione ENTER para continuar!");
                    sc.nextLine();
                    break;

                case 2:
                    System.out.println("\n╔════════════════════════════════════════════════════════════════════╗");
                    System.out.println("║                        Minhas Solicitações                         ║");
                    System.out.println("╠════════════════════════════════════════════════════════════════════╣");

                    s.listarSolicitacoes();
                    System.out.println("\n✅ Solicitações listadas com sucesso!");
                    System.out.println("\n⚠️ Pressione ENTER para continuar!");
                    sc.nextLine();
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
