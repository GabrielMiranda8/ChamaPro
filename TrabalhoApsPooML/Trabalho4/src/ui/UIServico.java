package ui;

import java.util.Scanner;

import control.Sistema;

public class UIServico {
    protected Sistema sis;
    protected Scanner scn;

    public UIServico() {
        sis = Sistema.getInstance();
        scn = new Scanner(System.in);
    }

    public void CadastrarServico() {
        System.out.print("Nome: ");
        String nome = scn.next();
        System.out.print("Descrição: ");
        String descricao = scn.next();
        System.out.print("Senha: ");
        String senha = scn.next();
        System.out.print("Dia de nascimento: ");
        int dia = scn.nextInt();
        System.out.print("Mês de nascimento: ");
        int mes = scn.nextInt();
        System.out.print("Ano de nascimento: ");
        int ano = scn.nextInt();
        System.out.print("CPF: ");
        String cpf = scn.next();

        sis.CadastrarServico(, , , , null);
    }

    public void ListarServicos(int largura) {

    }

    public void AlterarServico(int largura) {

    }

    public void ExcluirServico(int largura) {

    }

}
