package ui;

import control.Sistema;
import control.exceptions.ServicoNaoEncontradoException;
import java.util.List;
import java.util.Scanner;
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

        System.out.println(sis.CadastrarServico(nome, descricao, preco, idProf));
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

        System.out.println(sis.ExcluirServico(id));
    }

    public void AlterarServico() {
        System.out.println("\n=== ALTERAR SERVIÇO ===");
        System.out.print("ID do serviço a alterar: ");
        int id = sc.nextInt();
        sc.nextLine();

        Servico s = sis.servicoExiste(id);
        if (s == null) {
            throw new ServicoNaoEncontradoException("Serviço não encontrado");
        }

        System.out.print("Novo nome (vazio para manter '" + s.getNome() + "'): ");
        String nome = sc.nextLine();
        if (nome != null && !nome.trim().isEmpty())
            s.setNome(nome);

        System.out.print("Nova descrição (vazio para manter): ");
        String descricao = sc.nextLine();
        if (descricao != null && !descricao.trim().isEmpty())
            s.setDescricao(descricao);

        System.out.print("Novo preço (vazio para manter): ");
        double preco = sc.nextDouble();
        if (preco > 0)
            s.setPreco(preco);

        sis.AlterarServico(s);
    }
}
