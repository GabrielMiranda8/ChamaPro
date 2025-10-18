package ui;

import java.util.List;
import java.util.Scanner;
import control.Sistema;
import model.Servico;

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
        System.out.print("Preço: ");
        double preco = scn.nextDouble();

        sis.CadastrarServico(nome, descricao, preco, 0);
    }

    public void ListarServicos(int largura) {

    }

    public void AlterarServico(int largura) {

    }

    public void ExcluirServico(int largura) {

    }

}
