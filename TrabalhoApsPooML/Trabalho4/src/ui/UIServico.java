package ui;

import java.util.List;
import java.util.Scanner;

import control.Sistema;
import model.Servico;

public class UIServico {
    protected Sistema sis;
    private Scanner sc;

    public UIServico() {
        sis = Sistema.getInstance();
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

        sis.CadastrarServico(nome, descricao, preco, idProf);;
    }

    public void ListarServicos(int largura) {
        System.out.println("\n=== LISTA DE SERVIÇOS ===");
        List<Servico> servicos = sis.ListarServicos();
        if (servicos == null || servicos.isEmpty()) {
            System.out.println("Nenhum serviço cadastrado ainda.");
            return;
        }
        System.out.printf("%-" + largura + "s", "ID");
        System.out.printf("%-" + largura + "s", "NOME");
        System.out.printf("%-" + largura + "s", "PREÇO");
        System.out.printf("%-" + largura + "s", "DESCRIÇÃO");
        System.out.printf("%-" + largura + "s", "PROFISSIONAIS");
        System.out.println();

        for (Servico s : servicos) {
            if (s != null) {
                String profs = sis.ListarProfissionaisDeServico(s.getId());
                System.out.printf("%-" + largura + "s", s.getId());
                System.out.printf("%-" + largura + "s", s.getNome());
                System.out.printf("%-" + largura + "s", "R$" + s.getPreco());
                System.out.printf("%-" + largura + "s", s.getDescricao());
                System.out.printf("%-" + largura + "s", profs);
                System.out.println();
            }
        }
    }

    public void RemoverServico(){
        System.out.print("ID do Servico: ");
        int id = sc.nextInt();

        sis.ExcluirServico(id);
    }
}
