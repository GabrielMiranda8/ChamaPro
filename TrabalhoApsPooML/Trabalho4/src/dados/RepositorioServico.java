package dados;

import java.util.ArrayList;
import java.util.List;

import model.Profissional;
import model.Servico;

public class RepositorioServico {
    protected List<Servico> servicos;

    public RepositorioServico() {
        servicos = new ArrayList<>();
    }

    public void adicionar(Servico servico) {
        servicos.add(servico);
    }

    public Servico buscarPorId(int id) {
        for (Servico servico : servicos) {
            if (servico.getId() == id) {
                return servico;
            }
        }
        return null;
    }

    public List<Servico> listar() {
        return servicos;
    }

    public boolean atualizar(Servico servicoAtualizado) {
        for (int i = 0; i < servicos.size(); i++) {
            if (servicos.get(i).getId() == servicoAtualizado.getId()) {
                servicos.set(i, servicoAtualizado);
                return true;
            }
        }
        return false;
    }

    public boolean remover(int id) {
        return servicos.removeIf(s -> s.getId() == id);
    }

    public List<Servico> listarPorProfissional(int idProfissional) {
        List<Servico> resultado = new ArrayList<>();
        for (Servico s : servicos) {
            if (s.getId() == idProfissional) {
                resultado.add(s);
            }
        }
        return resultado;
    }

    public String listarProfissionais(int id) {
        String profs = "";
        for (int i = 0; i < servicos.size(); i++) {
            if (servicos.get(i).getId() == id) {
                for (int j = 0; j < servicos.get(i).getProfissionais().size(); j++) {
                    if (j + 1 < servicos.get(i).getProfissionais().size())
                        profs += servicos.get(i).getProfissionais().get(j).getNome() + ", ";
                    else
                        profs += servicos.get(i).getProfissionais().get(j).getNome();

                }
            }
        }
        return profs;
    }

    public void AssociarProfissional(int id, Profissional p) {
        for (int i = 0; i < servicos.size(); i++) {
            if (servicos.get(i).getId() == id) {
                servicos.get(i).getProfissionais().add(p);
            }
        }
    }

    public void DesassociarProfissional(int id, int idProfissional) {
        for (int i = 0; i < servicos.size(); i++) {
            if (servicos.get(i).getId() == id) {
                for (int j = 0; j < servicos.get(i).getProfissionais().size(); j++) {
                    if (servicos.get(i).getProfissionais().get(j).getId() == idProfissional)
                    servicos.get(i).getProfissionais().remove(j);
                }
            }
        }
    }

    public void DesassociarProfissionalDeServicos(int idProfissional){
        for (int i = 0; i < servicos.size(); i++) {
            DesassociarProfissional(servicos.get(i).getId(), idProfissional);
        }
    }
}
