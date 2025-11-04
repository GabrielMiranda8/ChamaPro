package ui;

import control.Sistema;
import java.util.List;
import java.util.Scanner;
import model.Cliente;

public class UICliente {
    protected Sistema sis;
    protected Scanner scn;

    public UICliente() {
        sis = Sistema.getInstance();
        scn = new Scanner(System.in);
    }

    public void CadastrarCliente() {
        System.out.print("Email: ");
        String email = scn.next();
        System.out.print("Nome: ");
        String nome = scn.next();
        System.out.print("Senha: ");
        String senha = scn.next();
        System.out.print("Dia de nascimento: ");
        String data = scn.next();
        System.out.print("CPF: ");
        String cpf = scn.next();
        System.out.print("Número da casa: ");
        int numero = scn.nextInt();
        System.out.print("Rua: ");
        String rua = scn.next();
        System.out.print("Bairro: ");
        String bairro = scn.next();
        System.out.print("Cidade: ");
        String cidade = scn.next();

        sis.CadastrarCliente(email, nome, senha, data, cpf, numero, rua, bairro, cidade);
    }

    public void ListarClientes(int largura) {
        System.out.printf("%-" + largura + "s", "ID");
        System.out.printf("%-" + largura + "s", "NOME");
        System.out.printf("%-" + largura + "s", "EMAIL");
        System.out.printf("%-" + largura + "s", "CPF");
        System.out.printf("%-" + largura + "s", "DATA NASC");
        System.out.printf("%-" + largura + "s", "CARACTERÍSTICAS");
        System.out.printf("%-" + largura + "s", "ENDEREÇO");
        System.out.println();
        List<Cliente> print = sis.ListarTodosClientes();

        for (int i = 0; i < print.size(); i++) {
            if (print.get(i) != null) {
                String carateristicas = sis.ListarCaracteristicasDeCliente(print.get(i).getId());
                System.out.printf("%-" + largura + "d", print.get(i).getId());
                System.out.printf("%-" + largura + "s", print.get(i).getNome());
                System.out.printf("%-" + largura + "s", print.get(i).getEmail());
                System.out.printf("%-" + largura + "s", print.get(i).getCpf());
                System.out.printf("%-" + largura + "s", print.get(i).getData());
                System.out.printf("%-" + largura + "s", carateristicas);
                System.out.printf("%-" + largura + "s",
                        print.get(i).getEndereco().getRua() + ", N" + print.get(i).getEndereco().getNumero() + ", "
                                + print.get(i).getEndereco().getBairro() + ", "
                                + print.get(i).getEndereco().getCidade());
                System.out.println();
            }
        }

    }

    public void AlterarCliente(int largura) {
        ListarClientes(largura);
        System.out.print("ID do Cliente");
        int id = scn.nextInt();
        System.out.print("Email: ");
        String email = scn.next();
        System.out.print("Nome: ");
        String nome = scn.next();
        System.out.print("Senha: ");
        String senha = scn.next();
        System.out.print("Número da casa: ");
        int numero = scn.nextInt();
        System.out.print("Rua: ");
        String rua = scn.next();
        System.out.print("Bairro: ");
        String bairro = scn.next();
        System.out.print("Cidade: ");
        String cidade = scn.next();

        sis.AlterarCliente(id, email, nome, senha, numero, rua, bairro, cidade);
    }

    public void RemoverCliente(int largura) {
        ListarClientes(largura);
        System.out.print("ID do Cliente: ");
        int id = scn.nextInt();

        System.out.println(sis.ExcluirCliente(id));
    }

}
