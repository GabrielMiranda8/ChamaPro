package control;

import dados.RepositorioProfissional;
import model.Profissional;
import model.Date;
import java.util.ArrayList;
import java.util.List;

public class ControleProfissional {
    protected RepositorioProfissional repoProfissional = new RepositorioProfissional();

    // Cadastrar - Validar CPF
    public void Add(String email, String nome, String senha, int dia, int mes, int ano, String cpf) {
        Date data = Date.getInstance(dia, mes, ano);
        if (email != null && nome != null && senha != null && data != null && cpf != null) {
            if (!repoProfissional.verificarRepetido(email, nome, cpf)) {
                Profissional p = Profissional.getInstance(email, nome, senha, data, cpf);
                repoProfissional.Add(p);
            }
        }
    }

    // Excluir - Validar CPF
    public void Excluir(int id) {
        if (repoProfissional.idExiste(id))
            repoProfissional.Excluir(id);
    }

    // Update
    public void Alterar(int id, String email, String nome, String senha, int dia, int mes, int ano, String cpf) {
        Date data = Date.getInstance(dia, mes, ano);
        if (repoProfissional.idExiste(id)) {
            if (email != null && nome != null && senha != null && data != null && cpf != null)
                repoProfissional.Alterar(id, email, nome, senha, data, cpf);
        }

    }

    // Imprimir
    public List<Profissional> ListarTodos() {
        return repoProfissional.ListarTodos();
    }
}
