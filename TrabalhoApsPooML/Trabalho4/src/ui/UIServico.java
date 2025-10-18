package ui;

import java.util.List;
import java.util.Scanner;
import control.ControleServico;
import model.Profissional;
import model.Servico;

public class UIServico {
    private ControleServico controleServico;
    private Profissional profissionalLogado;
    private Scanner sc;

    public UIServico(ControleServico controleServico, Profissional profissionalLogado) {
        this.controleServico = controleServico;
        this.profissionalLogado = profissionalLogado;
        this.sc = new Scanner(System.in);
    }

    public void cadastrarServico() {
        System.out.println("\n=== CADASTRAR SERVIÇO ===");
        System.out.print("ID do serviço: ");
        int id = sc.nextInt();
        sc.nextLine();

        System.out.print("Nome do serviço: ");
        String nome = sc.nextLine();

        System.out.print("Descrição: ");
        String descricao = sc.nextLine();

        System.out.print("Preço: R$");
        double preco = sc.nextDouble();
        sc.nextLine();

        controleServico.cadastrarServico(id, nome, descricao, preco, profissionalLogado);
    }

    public void listarServicos() {
        System.out.println("\n=== LISTA DE SERVIÇOS ===");
        List<Servico> servicos = controleServico.listarTodos();
        if (servicos.isEmpty()) {
            System.out.println("Nenhum serviço cadastrado ainda.");
        } else {
            for (Servico s : servicos) {
                System.out.println(s);
            }
        }
    }

    public void associarAUmServico() {
        System.out.println("\n=== ASSOCIAR A UM SERVIÇO ===");
        System.out.print("Digite o ID do serviço que deseja se associar: ");
        int idServico = sc.nextInt();
        sc.nextLine();

        controleServico.associarProfissionalAoServico(idServico, profissionalLogado);
    }

    public void removerAssociacao() {
        System.out.println("\n=== REMOVER ASSOCIAÇÃO ===");
        System.out.print("Digite o ID do serviço: ");
        int idServico = sc.nextInt();
        sc.nextLine();

        controleServico.removerAssociacao(idServico, profissionalLogado);
    }

    public void listarServicosDoProfissional() {
        System.out.println("\n=== MEUS SERVIÇOS ===");
        List<Servico> meusServicos = controleServico.listarPorProfissional(profissionalLogado);
        if (meusServicos.isEmpty()) {
            System.out.println("Você ainda não está associado a nenhum serviço.");
        } else {
            for (Servico s : meusServicos) {
                System.out.println(s);
            }
        }
    }
}
