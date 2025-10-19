package control;

import model.Profissional;
import model.Servico;
import dados.RepositorioServico;

import java.util.List;

public class ControleServico {
    protected RepositorioServico repo;
    private int nextId = 1;

    public ControleServico() {
        this.repo = new RepositorioServico();
        List<Servico> lista = repo.listar();
        int max = 0;
        for (Servico s : lista) {
            if (s.getId() > max)
                max = s.getId();
        }
        this.nextId = max + 1;
    }

    public ControleServico(RepositorioServico repo) {
        this.repo = repo;
        int max = 0;
        for (Servico s : repo.listar()) {
            if (s.getId() > max)
                max = s.getId();
        }
        this.nextId = max + 1;
    }

    public String cadastrarServico(String nome, String descricao, double preco, Profissional criador) {
        if (criador == null) {
            return("Criador inválido.");
        }
        Servico serv = new Servico(nextId++, nome, descricao, preco, criador);
        repo.adicionar(serv);
        return("Serviço criado por " + criador.getNome());
    }

    public String removerAssociacao(int idServico, Profissional profissional) {
        Servico s = repo.buscarPorId(idServico);
        if (s == null) {
            return("Serviço não encontrado.");
            
        }
        s.removerProfissional(profissional);
        return("Associação removida.");
    }

    public String removerServico(int id) {
        boolean removed = repo.remover(id);
        if (removed)
            return("Serviço removido.");
        else
            return("Serviço não encontrado.");
    }

    public boolean atualizarServico(Servico servicoAtualizado) {
        return repo.atualizar(servicoAtualizado);
    }

    public List<Servico> listarServicos() {
        return repo.listar();
    }

    public List<Servico> listarPorProfissional(int id) {
        return repo.listarPorProfissional(id);
    }

    public Servico buscarPorId(int id) {
        return repo.buscarPorId(id);
    }

    public String ListarProfissioais(int id) {
        return repo.listarProfissionais(id);
    }

    public void AssociarProfissional(int id, Profissional p){
        repo.AssociarProfissional(id, p);
    }

    public void DesassociarProfissional(int id, Profissional p){
        repo.DesassociarProfissional(id, p.getId());
    }

    public void DesassociarProfissionalDeServicos(int id){
        repo.DesassociarProfissionalDeServicos(id);
    }
}
