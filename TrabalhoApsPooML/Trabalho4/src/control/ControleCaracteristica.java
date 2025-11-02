package control;

import dados.RepositorioCaracteristica;
import model.Caracteristica;
import model.Profissional;
import model.Cliente;

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

    public String cadastrarCaracteristica(String nome, String descricao, Profissional criador) {
        if (nome == null || descricao == null) {
            return ("Dados inválidos.");

        }
        if (repo.verificarRepetido(nome)) {
            return ("Característica com esse nome já existe.");
        }
        Caracteristica c = new Caracteristica(nextId++, nome, descricao, criador);
        repo.adicionar(c);
        return ("Característica cadastrada: " + nome);
    }

    public String associarProfissionalACaracteristica(int idCaracteristica, Profissional profissional) {
        Caracteristica c = repo.buscarPorId(idCaracteristica);
        if (c == null) {
            return ("Característica não encontrada.");

        }
        c.adicionarProfissional(profissional);
        return ("Profissional " + profissional.getNome() + " associado à característica " + c.getNome());
    }

    public String removerAssociacao(int idCaracteristica, Profissional profissional) {
        Caracteristica c = repo.buscarPorId(idCaracteristica);
        if (c == null || profissional == null) {
            return ("Erro.");
        }
        c.removerProfissional(profissional);
        return ("Associação removida.");
    }

    // --- métodos para lidar com clientes ---
    public String associarClienteACaracteristica(int idCaracteristica, Cliente cliente) {
        Caracteristica c = repo.buscarPorId(idCaracteristica);
        if (c == null || cliente == null) {
            return ("Característica ou cliente não encontrado.");
        }
        c.adicionarCliente(cliente);
        return ("Cliente " + cliente.getNome() + " associado à característica " + c.getNome());
    }

    public String removerAssociacaoCliente(int idCaracteristica, Cliente cliente) {
        Caracteristica c = repo.buscarPorId(idCaracteristica);
        if (c == null || cliente == null) {
            return ("Erro.");
        }
        c.removerCliente(cliente);
        return ("Associação removida.");
    }

    public void removerProfissionalDeTodasCaracteristicas(Profissional profissional) {
        if (profissional == null)
            return;
        for (Caracteristica c : repo.listar()) {
            c.removerProfissional(profissional);
        }
    }

    public void removerClienteDeTodasCaracteristicas(Cliente cliente) {
        if (cliente == null)
            return;
        for (Caracteristica c : repo.listar()) {
            c.removerCliente(cliente);
        }
    }
    // --- fim novos métodos ---

    public String removerCaracteristica(int id) {
        boolean removed = repo.remover(id);
        if (removed)
            return ("Característica removida.");
        else
            return ("Característica não encontrada.");
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

    public String ListarClientes(int id) {
        return repo.listarClientes(id);
    }
}