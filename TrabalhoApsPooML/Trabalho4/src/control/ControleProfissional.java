package control;

import control.exceptions.DataInvalidaException;
import dados.RepositorioProfissional;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import model.Profissional;
import model.Servico;

public class ControleProfissional {
    protected RepositorioProfissional repoProfissional = new RepositorioProfissional();

    // Cadastrar
    public void Add(String email, String nome, String senha, String data, String cpf) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        try {
			Date data2 = sdf.parse(data);
			System.out.println("pq não deu erro");
			System.out.println(data2);
		} catch (ParseException e) {
            throw new DataInvalidaException("Data inválida: " + data);
		}
    
        if (email != null && nome != null && senha != null && data != null && cpf != null) {
            if (!repoProfissional.verificarRepetido(email, cpf) && repoProfissional.ValidarCPF(cpf)) {
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

    // Update 
    public void Alterar(int id, String email, String nome, String senha) {
        if (repoProfissional.idExiste(id)) {
            if (email != null && nome != null && senha != null)
                repoProfissional.Alterar(id, email, nome, senha);
        };
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
