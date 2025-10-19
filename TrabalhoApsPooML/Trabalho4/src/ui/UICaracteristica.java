package ui;

import java.util.List;
import java.util.Scanner;

import control.Sistema;
import control.ControleCaracteristica;
import model.Caracteristica;
import model.Profissional;

public class UICaracteristica {
    private ControleCaracteristica controle;
    private Sistema sis;
    private Scanner sc;

    public UICaracteristica() {
        sis = Sistema.getInstance();
        this.controle = Sistema.getInstance().getControleCaracteristica();
        this.sc = new Scanner(System.in);
    }

    public void CadastrarCaracteristica() {
        System.out.println("\n=== CADASTRAR CARACTERÍSTICA ===");
        System.out.print("ID do profissional criador (opcional, 0 para nenhum): ");
        int idProf = sc.nextInt();
        sc.nextLine();

        System.out.print("Nome: ");
        String nome = sc.nextLine();

        System.out.print("Descrição: ");
        String descricao = sc.nextLine();

        Profissional p = null;
        if (idProf > 0) {
            p = Sistema.getInstance().BuscarPorId(idProf);
            if (p == null) {
                System.out.println("Profissional não encontrado; a característica será criada sem criador.");
            }
        }

        controle.cadastrarCaracteristica(nome, descricao, p);
    }

    public void ListarCaracteristicas(int largura) {
        System.out.println("\n=== LISTA DE CARACTERÍSTICAS ===");
        List<Caracteristica> lista = controle.listarCaracteristicas();
        if (lista == null || lista.isEmpty()) {
            System.out.println("Nenhuma característica cadastrada.");
            return;
        }
        System.out.printf("%-" + largura + "s", "ID");
        System.out.printf("%-" + largura + "s", "NOME");
        System.out.printf("%-" + largura + "s", "DESCRIÇÃO");
        System.out.printf("%-" + largura + "s", "PROFISSIONAIS");
        System.out.println();
        for (Caracteristica c : lista) {
            if (c != null) {
                String profs = sis.ListarProfissioaisDeCaracteristica(c.getId());
                System.out.printf("%-" + largura + "d", c.getId());
                System.out.printf("%-" + largura + "s", c.getNome());
                System.out.printf("%-" + largura + "s", c.getDescricao());
                System.out.printf("%-" + largura + "s", profs);
                System.out.println();
            }
        }
    }

    public void AlterarCaracteristica() {
        System.out.println("\n=== ALTERAR CARACTERÍSTICA ===");
        System.out.print("ID da característica a alterar: ");
        int id = sc.nextInt();
        sc.nextLine();

        Caracteristica c = controle.buscarPorId(id);
        if (c == null) {
            System.out.println("Característica não encontrada.");
            return;
        }

        System.out.print("Novo nome (vazio para manter '" + c.getNome() + "'): ");
        String nome = sc.nextLine();
        if (nome != null && !nome.trim().isEmpty())
            c.setNome(nome);

        System.out.print("Nova descrição (vazio para manter): ");
        String descricao = sc.nextLine();
        if (descricao != null && !descricao.trim().isEmpty())
            c.setDescricao(descricao);

        boolean ok = controle.atualizarCaracteristica(c);
        if (ok)
            System.out.println("Característica atualizada.");
        else
            System.out.println("Falha ao atualizar característica.");
    }

    public void RemoverCaracteristica(int largura) {
        System.out.println("\n=== REMOVER CARACTERÍSTICA ===");
        ListarCaracteristicas(largura);
        System.out.print("ID da característica a remover: ");
        int id = sc.nextInt();
        sc.nextLine();

        controle.removerCaracteristica(id);
    }

    public void AtribuirCaracteristicaAProfissional(int largura) {
        System.out.println("\n=== ATRIBUIR CARACTERÍSTICA A PROFISSIONAL ===");
        ListarCaracteristicas(largura);
        System.out.print("ID da característica: ");
        int idCar = sc.nextInt();
        sc.nextLine();

        System.out.print("ID do profissional a associar: ");
        int idProf = sc.nextInt();
        sc.nextLine();

        Profissional p = Sistema.getInstance().BuscarPorId(idProf);
        if (p == null) {
            System.out.println("Profissional não encontrado.");
            return;
        }

        controle.associarProfissionalACaracteristica(idCar, p);
    }
}
