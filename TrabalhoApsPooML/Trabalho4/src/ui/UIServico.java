package ui;

import java.util.List;
import java.util.Scanner;

import control.Sistema;
import control.ControleServico;
import model.Profissional;
import model.Servico;

public class UIServico {
    private ControleServico controleServico;
    private Scanner sc;

    public UIServico() {
        this.controleServico = Sistema.getInstance().getControleServico();
        this.sc = new Scanner(System.in);
    }

    public void CadastrarServico(int largura) {
        System.out.println("\n=== CADASTRAR SERVIÇO ===");
        System.out.print("ID do profissional criador: ");
        int idProf = sc.nextInt();
        sc.nextLine();

        System.out.print("Nome do serviço: ");
        String nome = sc.nextLine();

        System.out.print("Descrição: ");
        String descricao = sc.nextLine();

        System.out.print("Preço: R$");
        double preco = sc.nextDouble();
        sc.nextLine();

        Sistema.getInstance().CadastrarServico(nome, descricao, preco, idProf);
    }

    public void ListarServicos(int largura) {
        System.out.println("\n=== LISTA DE SERVIÇOS ===");
        List<Servico> servicos = controleServico.listarServicos();
        if (servicos == null || servicos.isEmpty()) {
            System.out.println("Nenhum serviço cadastrado ainda.");
            return;
        }
        for (Servico s : servicos) {
            if (s != null) {
                System.out.printf("%-" + largura + "s", s.getId());
                System.out.printf("%-" + largura + "s", s.getNome());
                System.out.printf("%-" + largura + "s", "R$" + s.getPreco());
                System.out.printf("%-" + largura + "s", s.getProfissionais().isEmpty() ? "nenhum" : s.getProfissionais().size() + " prof(s)");
                System.out.println();
            }
        }
    }

    public void cadastrarServicoInteractive() {
        System.out.print("ID do profissional criador: ");
        int idProf = sc.nextInt();
        sc.nextLine();

        System.out.print("Nome do serviço: ");
        String nome = sc.nextLine();

        System.out.print("Descrição: ");
        String descricao = sc.nextLine();

        System.out.print("Preço: R$");
        double preco = sc.nextDouble();
        sc.nextLine();

        Sistema.getInstance().CadastrarServico(nome, descricao, preco, idProf);
    }
}
