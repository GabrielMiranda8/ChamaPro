package control;

import model.Profissional;
import model.Servico;
import dados.RepositorioServico;

import java.util.List;

public class ControleServico {
    private RepositorioServico repo;

    public ControleServico(RepositorioServico repo) {
        this.repo = repo;
    }

    public void cadastrarServico(int id, String nome, String descricao, double preco, Profissional criador) {
        if (criador == null) {
            System.out.println("Criador inválido.");
            return;
        }
        Servico serv = new Servico(id, nome, descricao, preco, criador);
        repo.adicionar(serv);
        System.out.println("Serviço criado por " + criador.getNome());
    }

    public void associarProfissionalAoServico(int idServico, Profissional profissional) {
        Servico s = repo.buscarPorId(idServico);
        if (s == null) {
            System.out.println("Serviço não encontrado.");
            return;
        }
        s.adicionarProfissional(profissional);
        System.out.println("Profissional " + profissional.getNome() + " associado ao serviço " + s.getNome());
    }

    public void removerAssociacao(int idServico, Profissional profissional) {
        Servico s = repo.buscarPorId(idServico);
        if (s == null) {
            System.out.println("Serviço não encontrado.");
            return;
        }
        s.removerProfissional(profissional);
        System.out.println("Associação removida.");
    }

    public List<Servico> listarTodos() {
        return repo.listar();
    }

    public List<Servico> listarPorProfissional(Profissional p) {
        return repo.listarPorProfissional(p);
    }

    public Servico buscarPorId(int id) {
        return repo.buscarPorId(id);
    }
}
