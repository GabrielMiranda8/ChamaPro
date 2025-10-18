package ui;

import java.util.Scanner;
import control.Sistema;

public class UIProfissional {
    protected Sistema sis;
    protected Scanner scn;

    public UIProfissional() {
		sis = Sistema.getInstance();
		scn = new Scanner(System.in);
	}

  public void CadastrarAluno(){

  }

  public void ListarTodos(){
    System.out.println(sis.ListarTodos());
  }
}     
