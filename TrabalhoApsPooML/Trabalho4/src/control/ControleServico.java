package control;

import dados.RepositorioServico;
import model.Servico;
import java.util.List;
import model.Profissional;

public class ControleServico {
    private RepositorioServico repositorioServico = new RepositorioServico();

    public void cadastrarServico(String nome, String descricao, double preco, Profissional profissional) {
        if (nome != null && descricao != null && preco > 0) {
            Servico servico = new Servico(nome, descricao, preco, profissional);
            repositorioServico.adicionar(servico);
            System.out.println("Serviço cadastrado com sucesso: " + servico.getNome());
        }

    }

    public List<Servico> listarServicos() {
        return repositorioServico.listar();
    }

    public void listarServicosPorProfissional(int id) {
        List<Servico> servicos = repositorioServico.listarPorProfissional(id);
        if (servicos.isEmpty()) {
            System.out.println("Nenhum serviço encontrado. ");
        } else {
            System.out.println("Serviços:");
            for (Servico s : servicos) {
                System.out.println(s);
            }
        }
    }

    public void atualizarServico(Servico servicoAtualizado) {
        boolean sucesso = repositorioServico.atualizar(servicoAtualizado);
        if (sucesso) {
            System.out.println("Serviço atualizado com sucesso!");
        } else {
            System.out.println("Serviço não encontrado.");
        }
    }

    public void removerServico(int id) {
        boolean sucesso = repositorioServico.remover(id);
        if (sucesso) {
            System.out.println("Serviço removido com sucesso!");
        } else {
            System.out.println("Serviço não encontrado.");
        }
    }
}
