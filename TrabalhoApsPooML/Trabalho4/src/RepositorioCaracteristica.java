package dados;

import model.Caracteristica;
import model.Profissional;
import model.Cliente;

import java.util.ArrayList;
import java.util.List;

public class RepositorioCaracteristica {
    protected List<Caracteristica> caracteristicas = new ArrayList<Caracteristica>();
    protected int quantCarac;

    public RepositorioCaracteristica() {

    }

    public void Add(Caracteristica c) {
        contarCaracteristica();
        if (c != null) {
            caracteristicas.add(c);
        }
    }

    public void Excluir(int id) {
        contarCaracteristica();
        for (int i = 0; i < quantCarac; i++) {
            if (caracteristicas.get(i).getId() == id) {
                caracteristicas.remove(caracteristicas.get(i));
                contarCaracteristica();
                i = -1;
            }
        }
    }

    public void Alterar(int id, String nome, String descricao) {
        contarCaracteristica();
        for (int i = 0; i < quantCarac; i++) {
            if (caracteristicas.get(i).getId() == id) {
                caracteristicas.get(i).setNome(nome);
                caracteristicas.get(i).setDescricao(descricao);
            }
        }
    }

    public List<Caracteristica> ListarTodos() {
        contarCaracteristica();
        List<Caracteristica> lista = new ArrayList<Caracteristica>();
        for (int i = 0; i < quantCarac; i++) {
            lista.add(new Caracteristica(caracteristicas.get(i)));
        }
        return lista;
    }

    public void contarCaracteristica() {
        quantCarac = 0;
        for (int i = 0; i < caracteristicas.size(); i++) {
            if (caracteristicas.get(i) != null) {
                quantCarac++;
            }
        }
    }

    public boolean idExiste(int id) {
        contarCaracteristica();
        for (int i = 0; i < quantCarac; i++) {
            if (caracteristicas.get(i).getId() == id)
                return true;
        }
        return false;
    }

    public boolean verificarRepetido(String nome) {
        contarCaracteristica();
        if (nome == null)
            return false;
        for (int i = 0; i < quantCarac; i++) {
            if (caracteristicas.get(i).getNome().equals(nome))
                return true;
        }
        return false;
    }

    public Caracteristica buscarPorId(int id) {
        for (Caracteristica c : caracteristicas) {
            if (c.getId() == id)
                return c;
        }
        return null;
    }

    public void adicionar(Caracteristica c) {
        this.Add(c);
    }

    public List<Caracteristica> listar() {
        return new ArrayList<Caracteristica>(caracteristicas);
    }

    public boolean atualizar(Caracteristica carAtualizada) {
        for (int i = 0; i < caracteristicas.size(); i++) {
            if (caracteristicas.get(i).getId() == carAtualizada.getId()) {
                caracteristicas.set(i, carAtualizada);
                return true;
            }
        }
        return false;
    }

    public boolean remover(int id) {
        return caracteristicas.removeIf(c -> c.getId() == id);
    }


    public List<Caracteristica> listarPorProfissional(Profissional prof) {
        List<Caracteristica> resultado = new ArrayList<>();
        if (prof == null)
            return resultado;
        for (Caracteristica c : caracteristicas) {
            for (Profissional p : c.getProfissionais()) {
                if (p != null && p.getId() == prof.getId()) {
                    resultado.add(c);
                    break;
                }
            }
        }
        return resultado;
    }

    public String listarProfissionais(int id) {
        String profs = "";
        for (int i = 0; i < caracteristicas.size(); i++) {
            if (caracteristicas.get(i).getId() == id) {
                for (int j = 0; j < caracteristicas.get(i).getProfissionais().size(); j++) {
                    if (j + 1 < caracteristicas.get(i).getProfissionais().size())
                        profs += caracteristicas.get(i).getProfissionais().get(j).getNome() + ", ";
                    else
                        profs += caracteristicas.get(i).getProfissionais().get(j).getNome();

                }
            }
        }
        return profs;
    }

    // lista os nomes dos clientes associados a uma característica (para exibição)
    public String listarClientes(int id) {
        String clientesStr = "";
        for (int i = 0; i < caracteristicas.size(); i++) {
            if (caracteristicas.get(i).getId() == id) {
                for (int j = 0; j < caracteristicas.get(i).getClientes().size(); j++) {
                    if (j + 1 < caracteristicas.get(i).getClientes().size())
                        clientesStr += caracteristicas.get(i).getClientes().get(j).getNome() + ", ";
                    else
                        clientesStr += caracteristicas.get(i).getClientes().get(j).getNome();
                }
            }
        }
        return clientesStr;
    }
}