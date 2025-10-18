package dados;
import java.util.ArrayList;
import java.util.List;
import model.Servico;
import model.Profissional;

public class RepositorioServico {
    private List<Servico> servicos;

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

    public List<Servico> buscarPorNome(String nome) {
        List<Servico> encontrados = new ArrayList<>();
        for (Servico servico : servicos) {
            if (servico.getNome().toLowerCase().contains(nome.toLowerCase())) {
                encontrados.add(servico);
            }
        }
        return encontrados;
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

    public List<Servico> listarPorProfissional(Profissional profissional) {
        List<Servico> resultado = new ArrayList<>();
        for (Servico s : servicos) {
            if (s.getProfissional().equals(profissional)) {
                resultado.add(s);
            }
        }
        return resultado;
    }
}
