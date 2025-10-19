package control;

import dados.RepositorioCaracteristica;
import model.Caracteristica;
import model.Profissional;

import java.util.List;

public class ControleCaracteristica {
    protected RepositorioCaracteristica repo;
    private int nextId = 1;

    public ControleCaracteristica() {
        this.repo = new RepositorioCaracteristica();
        int max = 0;
        for (Caracteristica c : repo.listar()) {
            if (c.getId() > max)
                max = c.getId();
        }
        this.nextId = max + 1;
    }

    public ControleCaracteristica(RepositorioCaracteristica repo) {
        this.repo = repo;
        int max = 0;
        for (Caracteristica c : repo.listar()) {
            if (c.getId() > max)
                max = c.getId();
        }
        this.nextId = max + 1;
    }

    public void cadastrarCaracteristica(String nome, String descricao, Profissional criador) {
        if (nome == null || descricao == null) {
            System.out.println("Dados inválidos.");
            return;
        }
        if (repo.verificarRepetido(nome)) {
            System.out.println("Característica com esse nome já existe.");
            return;
        }
        Caracteristica c = new Caracteristica(nextId++, nome, descricao, criador);
        repo.adicionar(c);
        System.out.println("Característica cadastrada: " + nome);
    }

    public void associarProfissionalACaracteristica(int idCaracteristica, Profissional profissional) {
        Caracteristica c = repo.buscarPorId(idCaracteristica);
        if (c == null) {
            System.out.println("Característica não encontrada.");
            return;
        }
        c.adicionarProfissional(profissional);
        System.out.println("Profissional " + profissional.getNome() + " associado à característica " + c.getNome());
    }

    public void removerAssociacao(int idCaracteristica, Profissional profissional) {
        Caracteristica c = repo.buscarPorId(idCaracteristica);
        if (c == null) {
            System.out.println("Característica não encontrada.");
            return;
        }
        c.removerProfissional(profissional);
        System.out.println("Associação removida.");
    }
    public void removerProfissionalDeTodasCaracteristicas(Profissional profissional) {
        if (profissional == null) return;
        for (Caracteristica c : repo.listar()) {
            c.removerProfissional(profissional);
        }
    }

    public void removerCaracteristica(int id) {
        boolean removed = repo.remover(id);
        if (removed)
            System.out.println("Característica removida.");
        else
            System.out.println("Característica não encontrada.");
    }

    public boolean atualizarCaracteristica(Caracteristica carAtualizada) {
        return repo.atualizar(carAtualizada);
    }

    public List<Caracteristica> listarCaracteristicas() {
        return repo.listar();
    }

    public List<Caracteristica> listarPorProfissional(Profissional p) {
        return repo.listarPorProfissional(p);
    }

    public Caracteristica buscarPorId(int id) {
        return repo.buscarPorId(id);
    }

    public String ListarProfissioais(int id) {
        return repo.listarProfissionais(id);
    }
}
