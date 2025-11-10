package ui;

import java.util.Scanner;

public class UIPrincipal {
    protected Scanner scn;
    protected UIServico uiServico;
    protected UIProfissional uiProfissional;
    protected UIUsuario uiUsuario;
    protected UICaracteristica uiCaracteristica;
    protected UICliente uiCliente;

    public UIPrincipal() {
        scn = new Scanner(System.in);
        uiServico = new UIServico();
        uiProfissional = new UIProfissional();
        uiUsuario = new UIUsuario();
        uiCaracteristica = new UICaracteristica();
        uiCliente = new UICliente();
    }

    public void Iniciar() {
        int largura = 25;
        Scanner scn = new Scanner(System.in);
        int escolha = Menu(scn);
        while (escolha > 0 && escolha < 24) {
            switch (escolha) {
                case 1:
                    uiProfissional.CadastrarProfissional();
                    break;
                case 2:
                    uiProfissional.ListarProfissionais(largura);
                    break;
                case 3:
                    uiProfissional.AlterarProfissional(largura);
                    break;
                case 4:
                    uiProfissional.RemoverProfissional(largura);
                    break;
                case 5:
                    uiProfissional.ListarProfissionais(largura);
                    uiServico.CadastrarServico(largura);
                    break;
                case 6:
                    uiServico.ListarServicos(largura);
                    break;
                case 7:
                    uiServico.ListarServicos(largura);
                    uiServico.AlterarServico();
                    break;
                case 8:
                    uiServico.ListarServicos(largura);
                    uiServico.RemoverServico();
                    break;
                case 9:
                    uiProfissional.ListarProfissionais(largura);
                    uiServico.ListarServicos(largura);
                    uiProfissional.AssociarServico();
                    break;
                case 10:
                    uiProfissional.ListarProfissionais(largura);
                    uiServico.ListarServicos(largura);
                    uiProfissional.DesassociarServico();
                    break;
                case 11:
                    uiProfissional.ListarProfissionais(largura);
                    uiCaracteristica.CadastrarCaracteristica();
                    break;
                case 12:
                    uiCaracteristica.ListarCaracteristicas(largura);
                    break;
                case 13:
                    uiCaracteristica.ListarCaracteristicas(largura);
                    uiCaracteristica.AlterarCaracteristica();
                    break;
                case 14:
                    uiCaracteristica.RemoverCaracteristica(largura);
                    break;
                case 15:
                    uiProfissional.ListarProfissionais(largura);
                    uiCaracteristica.AtribuirCaracteristicaAProfissional(largura);
                    break;
                case 16:
                    uiProfissional.ListarProfissionais(largura);
                    uiCaracteristica.DesatribuirCaracteristicaAProfissional(largura);
                    break;
                case 17:
                    uiCliente.CadastrarCliente();
                    break;
                case 18:
                    uiCliente.ListarClientes(largura);
                    break;
                case 19:
                    uiCliente.AlterarCliente(largura);
                    break;
                case 20:
                    uiCliente.RemoverCliente(largura);
                    break;
                case 21:
                    uiCliente.ListarClientes(largura);
                    uiCaracteristica.AtribuirCaracteristicaACliente(largura);
                    break;
                case 22:
                    uiCliente.ListarClientes(largura);
                    uiCaracteristica.DesatribuirCaracteristicaACliente(largura);
                    break;
                case 23:
                    largura = EditarLargura(largura, scn);
                    break;
                default:
                    break;
            }
            escolha = Menu(scn);
        }
        System.out.println("           Encerrando Programa...");
    }

    static int Menu(Scanner scn) {
        System.out.println("    1. Cadastrar Profissional                    13. Alterar Característica");
        System.out.println("    2. Listar Profissionais                      14. Remover Característica");
        System.out.println("    3. Alterar Profissional                      15. Atribuir Característica a Profissional");
        System.out.println("    4. Remover Profissional                      16. Desatribuir Característica a Profissional");
        System.out.println("    5. Cadastrar Serviço                         17. Cadastrar Cliente");
        System.out.println("    6. Listar Serviços                           18. Listar Clientes");
        System.out.println("    7. Alterar Serviço                           19. Alterar Cliente");
        System.out.println("    8. Remover Serviços                          20. Remover Cliente");
        System.out.println("    9. Atribuir Serviço a Profissional           21. Atribuir Característica a Cliente");
        System.out.println("    10. Desatribuir Serviço a Profissional       22. Desatribuir Característica a Cliente");
        System.out.println("    11. Cadastrar Característica                 23. Editar Largura");
        System.out.println("    12. Listar Características                   24. Sair");
        System.out.print("Escolha: ");
        int escolha = scn.nextInt();
        return escolha;
    }

    static int EditarLargura(int largura, Scanner scn) {
        System.out.print("Nova largura de coluna: ");
        largura = scn.nextInt();
        if (largura > 0) {
            return largura;
        } else {
            return 25;
        }
    }
}
