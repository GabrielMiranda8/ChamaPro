package dados;

import java.util.ArrayList;
import java.util.List;

import model.Date;
import model.Endereco;
import model.Caracteristica;
import model.Cliente;

public class RepositorioCliente {
    protected List<Cliente> clientes;
    protected int quantCliente;

    public RepositorioCliente() {
        clientes = new ArrayList<Cliente>();
    }

    public void Add(Cliente c) {
        contarCliente();
        if (c != null) {
            clientes.add(c);
        }
    }

    public void Excluir(int id) {
        contarCliente();
        for (int i = 0; i < quantCliente; i++) {
            if (clientes.get(i).getId() == id)
                clientes.remove(i);
            contarCliente();
        }
    }

    public void Alterar(int id, String email, String nome, String senha, Date data, String cpf, Endereco endereco) {
        contarCliente();
        for (int i = 0; i < quantCliente; i++) {
            if (clientes.get(i).getId() == id) {
                clientes.get(i).setCpf(cpf);
                clientes.get(i).setData(data);
                clientes.get(i).setEmail(email);
                clientes.get(i).setNome(nome);
                clientes.get(i).setSenha(senha);
                clientes.get(i).setEndereco(endereco);
            }
        }
    }

    public List<Cliente> ListarTodos() {
        contarCliente();
        List<Cliente> lista = new ArrayList<Cliente>();

        for (int i = 0; i < quantCliente; i++) {
            lista.add(new Cliente(clientes.get(i)));
        }

        return lista;
    }

    public void contarCliente() {
        quantCliente = 0;
        for (int i = 0; i < clientes.size(); i++) {
            if (clientes.get(i) != null) {
                quantCliente++;
            }
        }
    }

    public boolean idExiste(int id) {
        contarCliente();
        for (int i = 0; i < quantCliente; i++) {
            if (clientes.get(i).getId() == id)
                return true;
        }
        return false;
    }

    public boolean CaracteristicaExiste(int idCliente, int idCaracteristica) {
        contarCliente();
        for (int i = 0; i < quantCliente; i++) {
            if (clientes.get(i).getId() == idCliente) {
                for (int j = 0; j < clientes.get(i).getCaracteristicas().size(); j++) {
                    if (clientes.get(i).getCaracteristicas().get(j).getId() == idCaracteristica)
                        return true;
                }
            }

        }
        return false;
    }

    public boolean verificarRepetido(String email, String cpf) {
        contarCliente();
        for (int i = 0; i < quantCliente; i++) {
            if (clientes.get(i).getEmail().equals(email))
                return true;
            if (clientes.get(i).getCpf().equals(cpf))
                return true;

        }
        return false;
    }

    public Cliente buscarPorId(int id) {
        contarCliente();
        for (int i = 0; i < quantCliente; i++) {
            if (clientes.get(i).getId() == id)
                return new Cliente(clientes.get(i));
        }
        return null;
    }

    public void AssociarCaracteristica(int idCliente, Caracteristica c) {
        if (idExiste(idCliente)) {
            if (!CaracteristicaExiste(idCliente, c.getId())) {
                contarCliente();
                for (int i = 0; i < quantCliente; i++) {
                    if (clientes.get(i).getId() == idCliente) {
                        clientes.get(i).getCaracteristicas().add(c);
                    }
                }
            }
        }
    }

    public void DesassociarCaracteristica(int idCliente, int idCaracteristica) {
        if (idExiste(idCliente)) {
            contarCliente();
            for (int i = 0; i < quantCliente; i++) {
                if (clientes.get(i).getId() == idCliente) {
                    for (int j = 0; j < clientes.get(i).getCaracteristicas().size(); j++) {
                        if (clientes.get(i).getCaracteristicas().get(j).getId() == idCaracteristica)
                            clientes.get(i).getCaracteristicas().remove(j);
                    }
                }
            }
        }
    }

    public void RemoverCaracteristica(int idCaracteristica) {
        contarCliente();
        for (int i = 0; i < quantCliente; i++) {
            DesassociarCaracteristica(clientes.get(i).getId(), idCaracteristica);
        }
    }

    public String ListarCaracteristicas(int id) {
        String caracteristicas = "";
        if (idExiste(id)) {
            contarCliente();
            for (int i = 0; i < quantCliente; i++) {
                if (clientes.get(i).getId() == id) {
                    for (int j = 0; j < clientes.get(i).getCaracteristicas().size(); j++) {
                        if (j + 1 < clientes.get(i).getCaracteristicas().size())
                            caracteristicas += clientes.get(i).getCaracteristicas().get(j).getNome() + ", ";
                        else
                            caracteristicas += clientes.get(i).getCaracteristicas().get(j).getNome();
                    }
                }
            }
        }
        return caracteristicas;
    }

    public static boolean ValidarCPF(String cpf) {
        if (cpf == null)
            return false;
        String numeros = "";
        for (int i = 0; i < cpf.length(); i++) {
            char c = cpf.charAt(i);
            if (c >= '0' && c <= '9') {
                numeros += c;
            }
        }
        cpf = numeros;

        if (cpf.length() != 11)
            return false;

        boolean repetido = true;
        for (int i = 1; i < cpf.length(); i++) {
            if (cpf.charAt(i) != cpf.charAt(0)) {
                repetido = false;
                break;
            }
        }
        if (repetido)
            return false;

        // o '0' é pra subtrair em ascii o valor dos digitos
        int soma = 0;
        for (int i = 0; i < 9; i++) {
            soma = soma + (cpf.charAt(i) - '0') * (10 - i);
        }

        int resto = soma % 11;
        int digito1;
        if (resto < 2) {
            digito1 = 0;
        } else {
            digito1 = 11 - resto;
        }

        soma = 0;
        for (int i = 0; i < 10; i++) {
            soma = soma + (cpf.charAt(i) - '0') * (11 - i);
        }

        resto = soma % 11;
        int digito2;
        if (resto < 2) {
            digito2 = 0;
        } else {
            digito2 = 11 - resto;
        }

        if (digito1 == (cpf.charAt(9) - '0') && digito2 == (cpf.charAt(10) - '0')) {
            return true;
        } else {
            return false;
        }
    }
}
