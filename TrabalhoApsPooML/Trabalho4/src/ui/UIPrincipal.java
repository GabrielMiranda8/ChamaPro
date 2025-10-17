package ui;

import java.util.Scanner;

public class UIPrincipal {
    protected Scanner scn;
    protected UIProfissional uiProfissional;
    protected UIServico uiServico;
    protected UIUsuario uiUsuario;
    protected UICaracteristica uiCaracteristica;


    public void Iniciar(){
        int largura = 25;
        int escolha = Menu(scn);
        while (escolha > 0 && escolha < 15) {
            switch (escolha) {
                case 1:
                    
                    break;
                case 2:
                    
                    break;
                case 3:
                    
                    break;
                case 4:
                    
                    break;
                case 5:
                    
                    break;
                case 6:
                    
                    break;
                case 7:
                    
                    break;
                case 8:
                    
                    break;
                case 9:
                    
                    break;
                case 10:
                    
                    break;
                case 11:
                    
                    break;
                case 12:
                    
                    break;
                case 13:
                    
                    break;
                case 14:
                    
                    break;
                default:
                    break;
            }
            escolha = Menu(scn);
        }
        System.out.println("           Encerrando Programa...");
    }

    static int Menu(Scanner scn) {
        System.out.println("    1. Cadastrar Profissional");
        System.out.println("    2. Listar Profissionais");
        System.out.println("    3. Alterar Profissional");
        System.out.println("    4. Remover Profissional");
        System.out.println("    5. Cadastrar Serviço");
        System.out.println("    6. Listar Serviços"); // colocar opcao pra listar os servicos de algum profissional especifico
        System.out.println("    7. Alterar Serviço");
        System.out.println("    8. Remover Serviços");
        System.out.println("    9. Atribuir Serviço a Profissional");
        System.out.println("    10. Sair");
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
