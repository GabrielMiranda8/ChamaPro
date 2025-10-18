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

    public void cadastrarServico(String nome, String descricao, double preco, Profissional criador) {
        if (criador == null) {
            System.out.println("Criador inválido.");
            return;
        }
        Servico serv = new Servico(nextId++, nome, descricao, preco, criador);
        repo.adicionar(serv);
        System.out.println("Serviço criado por " + criador.getNome());
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

    public void removerServico(int id) {
        boolean removed = repo.remover(id);
        if (removed)
            System.out.println("Serviço removido.");
        else
            System.out.println("Serviço não encontrado.");
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
