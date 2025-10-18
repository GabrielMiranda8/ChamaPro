package dados;

import model.Profissional;
import model.Servico;

import java.util.ArrayList;
import java.util.List;

public class RepositorioServico {
    private List<Servico> servicos = new ArrayList<>();

    public void adicionar(Servico servico) {
        servicos.add(servico);
    }

    public Servico buscarPorId(int id) {
        for (Servico s : servicos) {
            if (s.getId() == id) return s;
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

    public List<Servico> listarPorProfissional(Profissional prof) {
        List<Servico> resultado = new ArrayList<>();
        if (prof == null) return resultado;
        for (Servico s : servicos) {
            if (s.getProfissionais().contains(prof)) resultado.add(s);
        }
        return resultado;
    }
}
