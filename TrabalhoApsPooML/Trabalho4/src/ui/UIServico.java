package ui;

import java.util.List;
import java.util.Scanner;

import control.Sistema;
import model.Profissional;
import model.Servico;

public class UIServico {
    protected Sistema sis;
    protected Scanner scn;

    public UIServico() {
        sis = Sistema.getInstance();
        scn = new Scanner(System.in);
    }

    public void CadastrarServico(int largura) {
        System.out.print("Nome: ");
        String nome = scn.next();
        System.out.print("Descrição: ");
        String descricao = scn.next();
        System.out.print("Preço: ");
        double preco = scn.nextDouble();

        System.out.print("ID do Profissional Cadastrante: ");
        int id = scn.nextInt();

        sis.CadastrarServico(nome, descricao, preco, id);
    }

    public void ListarServicos(int largura) {
        System.out.printf("%-" + largura + "s", "ID");
        System.out.printf("%-" + largura + "s", "NOME");
        System.out.printf("%-" + largura + "s", "DESCRIÇÃO");
        System.out.printf("%-" + largura + "s", "PREÇO");
        System.out.printf("%-" + largura + "s", "PROFISSIONAIS");
        System.out.println();
        List<Servico> print = sis.ListarServicos();

        for (int i = 0; i < print.size(); i++) {
            if (print.get(i) != null) {
                System.out.printf("%-" + largura + "d", print.get(i).getId());
                System.out.printf("%-" + largura + "s", print.get(i).getNome());
                System.out.printf("%-" + largura + "s", print.get(i).getDescricao());
                System.out.printf("%-" + largura + ".2f", print.get(i).getPreco());

                System.out.printf("%-" + largura + "s", " ");
                System.out.println();
            }
        }

    }

    public void AlterarServico(int largura) {

    }

    public void ExcluirServico(int largura) {

    }

}
