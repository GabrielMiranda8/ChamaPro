package control;

import dados.RepositorioProfissional;
import model.Profissional;
import model.Servico;
import model.Date;
import java.util.ArrayList;
import java.util.List;

public class ControleProfissional {
    protected RepositorioProfissional repoProfissional = new RepositorioProfissional();

    // Cadastrar - Validar CPF
    public void Add(String email, String nome, String senha, int dia, int mes, int ano, String cpf) {
        Date data = Date.getInstance(dia, mes, ano);
        if (email != null && nome != null && senha != null && data != null && cpf != null) {
            if (!repoProfissional.verificarRepetido(email, cpf)) {
                Profissional p = Profissional.getInstance(email, nome, senha, data, cpf);
                repoProfissional.Add(p);
            }
        }
    }

    // Excluir 
    public void Excluir(int id) {
        if (repoProfissional.idExiste(id))
            repoProfissional.Excluir(id);
    }

    // Update - Validar CPF
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

    public Profissional BuscarPorId(int id){
        return repoProfissional.buscarPorId(id);
    }

    public String ListarServicos(int id){
        return repoProfissional.ListarServicos(id);
    }

    public void AssociarServico(int id, Servico s){
        if (repoProfissional.idExiste(id) && !repoProfissional.ServicoExiste(id, s.getId()))
        repoProfissional.AssociarServico(id, s);
    }

    public void DesassociarServico(int idProfissional, int idServico){
        if (repoProfissional.idExiste(idProfissional) && repoProfissional.ServicoExiste(idProfissional, idServico))
        repoProfissional.DesassociarServico(idProfissional, idServico);
    }

    public void RemoverServico(int id){
        repoProfissional.RemoverServico(id);
    }
}
