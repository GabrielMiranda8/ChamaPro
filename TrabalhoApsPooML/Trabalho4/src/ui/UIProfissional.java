package ui;

import control.Sistema;
import java.util.List;
import java.util.Scanner;
import model.Profissional;

public class UIProfissional {
  protected Sistema sis;
  protected Scanner scn;

  public UIProfissional() {
    sis = Sistema.getInstance();
    scn = new Scanner(System.in);
  }

  public void CadastrarProfissional() {
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

    sis.Add(email, nome, senha, data, cpf);
  }

  public void ListarProfissionais(int largura) {
    System.out.printf("%-" + largura + "s", "ID");
    System.out.printf("%-" + largura + "s", "NOME");
    System.out.printf("%-" + largura + "s", "EMAIL");
    System.out.printf("%-" + largura + "s", "CPF");
    System.out.printf("%-" + largura + "s", "DATA NASC");
    System.out.printf("%-" + largura + "s", "SERVIÇOS");
    System.out.printf("%-" + largura + "s", "CARACTERÍSTICAS");
    System.out.println();
    List<Profissional> print = sis.ListarTodos();

    for (int i = 0; i < print.size(); i++) {
      if (print.get(i) != null) {
        String servicos = sis.ListarServicosDeProfissional(print.get(i).getId());
        String carateristicas = sis.ListarCaracteristicasDeProfissional(print.get(i).getId());
        System.out.printf("%-" + largura + "d", print.get(i).getId());
        System.out.printf("%-" + largura + "s", print.get(i).getNome());
        System.out.printf("%-" + largura + "s", print.get(i).getEmail());
        System.out.printf("%-" + largura + "s", print.get(i).getCpf());
        System.out.printf("%-" + largura + "s", print.get(i).getData());
        System.out.printf("%-" + largura + "s", servicos);
        System.out.printf("%-" + largura + "s", carateristicas);
        System.out.println();
      }
    }

  }

  public void AlterarProfissional(int largura) {
    ListarProfissionais(largura);
    System.out.print("ID do Profissional");
    int id = scn.nextInt();
    System.out.print("Email: ");
    String email = scn.next();
    System.out.print("Nome: ");
    String nome = scn.next();
    System.out.print("Senha: ");
    String senha = scn.next();

    sis.Alterar(id, email, nome, senha);
  }

  public void RemoverProfissional(int largura) {
    ListarProfissionais(largura);
    System.out.print("ID do Profissional: ");
    int id = scn.nextInt();

    System.out.println(sis.ExcluirProfissional(id));
  }

  public void AssociarServico() {
    System.out.print("ID do Profissional: ");
    int idProfissional = scn.nextInt();
    System.out.print("ID do Serviço: ");
    int idServico = scn.nextInt();

    System.out.println(sis.AssociarServico(idProfissional, idServico));
  }

  public void DesassociarServico() {
    System.out.print("ID do Profissional: ");
    int idProfissional = scn.nextInt();
    System.out.print("ID do Serviço: ");
    int idServico = scn.nextInt();

    System.out.println(sis.DesassociarServico(idProfissional, idServico));
  }
}
