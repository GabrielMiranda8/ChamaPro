package control;

import dados.RepositorioProfissional;
import model.Profissional;
import model.Servico;
import model.Date;
import java.util.List;

public class ControleProfissional {
    protected RepositorioProfissional repoProfissional = new RepositorioProfissional();

    // Cadastrar
    public String Add(String email, String nome, String senha, int dia, int mes, int ano, String cpf) {
        Date data = Date.getInstance(dia, mes, ano);
        if (email != null && nome != null && senha != null && data != null && cpf != null) {
            if (!repoProfissional.verificarRepetido(email, cpf) && repoProfissional.ValidarCPF(cpf)) {
                Profissional p = Profissional.getInstance(email, nome, senha, data, cpf);
                repoProfissional.Add(p);
                return("Profissional cadastrado com sucesso.");
            }
        }
        return("Profissional não cadastrado");
    }

    // Excluir
    public void Excluir(int id) {
        if (repoProfissional.idExiste(id))
            repoProfissional.Excluir(id);
    }

    // Update 
    public String Alterar(int id, String email, String nome, String senha, int dia, int mes, int ano, String cpf) {
        Date data = Date.getInstance(dia, mes, ano);
        if (repoProfissional.idExiste(id) && repoProfissional.ValidarCPF(cpf)) {
            if (email != null && nome != null && senha != null && data != null && cpf != null)
                repoProfissional.Alterar(id, email, nome, senha, data, cpf);
                return("Profissional alterado com sucesso.");
        }
        return("Profissional não alterado.");
    }

    // Imprimir
    public List<Profissional> ListarTodos() {
        return repoProfissional.ListarTodos();
    }

    public Profissional BuscarPorId(int id) {
        return repoProfissional.buscarPorId(id);
    }

    public String ListarServicos(int id) {
        return repoProfissional.ListarServicos(id);
    }

    public String ListarCaracteristicas(int id) {
        return repoProfissional.ListarCaracteristicas(id);
    }

    public String AssociarServico(int id, Servico s) {
        if (repoProfissional.idExiste(id) && !repoProfissional.ServicoExiste(id, s.getId())){
            repoProfissional.AssociarServico(id, s);
            return("Serviço atribuído com sucesso.");
        }
        return("Serviço não atribuído."); 
    }

    public String DesassociarServico(int idProfissional, int idServico) {
        if (repoProfissional.idExiste(idProfissional) && repoProfissional.ServicoExiste(idProfissional, idServico)){
            repoProfissional.DesassociarServico(idProfissional, idServico);
            return("Serviço desatribuído com sucesso.");
        }
        return("Serviço não desatribuído.");  
    }

    public void RemoverServico(int id) {
        repoProfissional.RemoverServico(id);
    }

    public void atualizarServico(Servico s){
        repoProfissional.AtualizarServico(s);
    }

    public void DesassociarCaracteristica(int idProfissional, int idCaracteristica) {
        if (repoProfissional.idExiste(idProfissional) && repoProfissional.CaracteristicaExiste(idProfissional, idCaracteristica))
            repoProfissional.DesassociarCaracteristica(idProfissional, idCaracteristica);
    }

    public void RemoverCaracteristica(int id) {
        repoProfissional.RemoverCaracteristica(id);
    }
}
