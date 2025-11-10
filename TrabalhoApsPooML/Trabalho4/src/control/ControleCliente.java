package control;

import control.exceptions.DataInvalidaException;
import dados.RepositorioCliente;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import model.Caracteristica;
import model.Cliente;
import model.Endereco;

public class ControleCliente {
    protected RepositorioCliente repoCliente;

    public ControleCliente() {
        repoCliente = new RepositorioCliente();
    }

    // Cadastrar
    public void Add(String email, String nome, String senha, String data, String cpf, int numero, String rua,
            String bairro, String cidade) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        try {
            Date data2 = sdf.parse(data);
        } catch (ParseException e) {
            throw new DataInvalidaException("Data inválida: " + data);
        }

        Endereco endereco = Endereco.getInstance(numero, rua, bairro, cidade);
        if (email != null && nome != null && senha != null && data != null && cpf != null && endereco != null) {
            if (!repoCliente.verificarRepetido(email, cpf) && repoCliente.ValidarCPF(cpf)) {
                Cliente c = Cliente.getInstance(email, nome, senha, data, cpf, endereco);
                repoCliente.Add(c);
            }
        }
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
    public void Alterar(int id, String email, String nome, String senha, int numero, String rua, String bairro,
            String cidade) {
        Endereco endereco = Endereco.getInstance(numero, rua, bairro, cidade);
        if (repoCliente.idExiste(id)) {
            if (email != null && nome != null && senha != null) {
                repoCliente.Alterar(id, email, nome, senha, endereco);
            }
        }
    }

    // Excluir
    public void Excluir(int id) {
        if (repoCliente.idExiste(id)) {
            repoCliente.Excluir(id);
        }
    }

    // Caracteristica / Cliente
    public void AssociarCaracteristica(int idCliente, Caracteristica c) {
        if (repoCliente.idExiste(idCliente)) {
            if (!repoCliente.CaracteristicaExiste(idCliente, c.getId())) {
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
