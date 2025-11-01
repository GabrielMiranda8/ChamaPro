package control;

import java.util.List;

import dados.RepositorioCliente;
import model.Date;
import model.Endereco;
import model.Caracteristica;
import model.Cliente;

public class ControleCliente {
    protected RepositorioCliente repoCliente;

    public ControleCliente() {
        repoCliente = new RepositorioCliente();
    }

    // Cadastrar
    public String Add(String email, String nome, String senha, int dia, int mes, int ano, String cpf, int numero,
            String rua, String bairro, String cidade) {
        Date data = Date.getInstance(dia, mes, ano);
        Endereco endereco = Endereco.getInstance(mes, rua, bairro, cidade);
        if (email != null && nome != null && senha != null && data != null && cpf != null && endereco != null) {
            if (!repoCliente.verificarRepetido(email, cpf) && repoCliente.ValidarCPF(cpf)) {
                Cliente c = Cliente.getInstance(email, nome, senha, data, cpf, endereco);
                repoCliente.Add(c);
                return ("Cliente cadastrado com sucesso.");
            }
        }
        return ("Cliente não cadastrado");
    }

    // Imprimir
    public List<Cliente> ListarTodos() {
        return repoCliente.ListarTodos();
    }

    public Cliente BuscarPorId(int id) {
        return repoCliente.buscarPorId(id);
    }

    public String ListarCaracteristicas(int id) {
        return repoCliente.ListarCaracteristicas(id);
    }

    // Alterar
    public String Alterar(int id, String email, String nome, String senha, int dia, int mes, int ano, String cpf,
            int numero,
            String rua, String bairro, String cidade) {
        Date data = Date.getInstance(dia, mes, ano);
        Endereco endereco = Endereco.getInstance(mes, rua, bairro, cidade);
        if (repoCliente.idExiste(id) && repoCliente.ValidarCPF(cpf)) {
            if (email != null && nome != null && senha != null && data != null && cpf != null)
                repoCliente.Alterar(id, email, nome, senha, data, cpf, endereco);
            return ("Cliente alterado com sucesso.");
        }
        return ("Cliente não alterado.");
    }

    // Excluir
    public void Excluir(int id) {
        if (repoCliente.idExiste(id))
            repoCliente.Excluir(id);
    }

    // Caracteristica / Cliente
    public void AssociarCaracteristica(int idCliente, Caracteristica c){
        if (repoCliente.idExiste(idCliente)){
             if (!repoCliente.CaracteristicaExiste(idCliente, c.getId())){
                repoCliente.AssociarCaracteristica(idCliente, c);
             }
        }
    }

    public void DesassociarCaracteristica(int idCliente, int idCaracteristica) {
        if (repoCliente.idExiste(idCliente)
                && repoCliente.CaracteristicaExiste(idCliente, idCaracteristica))
            repoCliente.DesassociarCaracteristica(idCliente, idCaracteristica);
    }

    public void RemoverCaracteristica(int id) {
        repoCliente.RemoverCaracteristica(id);
    }
}
