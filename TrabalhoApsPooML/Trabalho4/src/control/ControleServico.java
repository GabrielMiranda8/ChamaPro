package control;
import dados.RepositorioServico;
import model.Servico;
import java.util.List;
import model.Profissional;


public class ControleServico {
    private RepositorioServico repositorioServico = new RepositorioServico();

    public void cadastrarServico(int id, String nome, String descricao, double preco, Profissional profissional) {
        Servico servico = new Servico(id, nome, descricao, preco, profissional);
        repositorioServico.adicionar(servico);
        System.out.println("Serviço cadastrado com sucesso: " + servico.getNome());
    }

    public void listarServicos() {
        List<Servico> servicos = repositorioServico.listar();
        if (servicos.isEmpty()) {
            System.out.println("Nenhum serviço cadastrado ainda.");
        } else {
            for (Servico s : servicos) {
                System.out.println(s);
            }
        }
    }

    public void listarServicosPorProfissional(Profissional profissional) {
        List<Servico> servicos = repositorioServico.listarPorProfissional(profissional);
        if (servicos.isEmpty()) {
            System.out.println("Nenhum serviço encontrado para o profissional: " + profissional.getNome());
        } else {
            System.out.println("Serviços de " + profissional.getNome() + ":");
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
