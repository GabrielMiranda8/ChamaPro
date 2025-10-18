package control;

import java.util.List;

import model.Profissional;

public class Sistema {
    private ControleCaracteristica cCaracteristica;
    private ControleProfissional cProfissional;
    private ControleServico cServico;
    private ControleUsuario cUsuario;

    private static Sistema instance;

    private Sistema() {
        cCaracteristica = new ControleCaracteristica();
        cProfissional = new ControleProfissional();
        cServico = new ControleServico();
        cUsuario = new ControleUsuario();
        init();
    }

    // singleton
    public static Sistema getInstance() {
        if (instance == null)
            instance = new Sistema();
        return instance;
    }

    // Inicialização
    public void init(){
        cProfissional.Add("lelis@gmail.com", "Henrique", "123", 5, 7, 2007, "111.111.111-11"); 
        cProfissional.Add("gabriel@gmail.com", "Gabriel", "123", 12, 06, 2009, "222.222.222-22");     
    }

    // Profissional
    public void Add(String email, String nome, String senha, int dia, int mes, int ano, String cpf){
        cProfissional.Add(email, nome, senha, dia, mes, ano, cpf);
    }

    public void Excluir(int id){
        cProfissional.Excluir(id);
    }

    public void Alterar(int id, String email, String nome, String senha, int dia, int mes, int ano, String cpf){
        cProfissional.Alterar(id, email, nome, senha, dia, mes, ano, cpf);
    }

    public List<Profissional> ListarTodos(){
        return cProfissional.ListarTodos();
    }
}
