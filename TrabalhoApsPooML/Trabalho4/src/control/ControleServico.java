package control;

import dados.RepositorioServico;
import model.Servico;
import model.Date;
import java.util.ArrayList;
import java.util.List;

public class ControleServico {
    private RepositorioServico repositorioServico;

    public ControleServico(RepositorioServico repositorioServico) {
        this.repositorioServico = repositorioServico;
    }

    public void cadastrarServico(String nome, String descricao, double preco, int idCriador) {
        Servico servico = new Servico(nome, descricao, preco, idCriador);
        repositorioServico.adicionar(servico);
        System.out.println("Serviço '" + nome + "' criado e associado ao profissional de ID " + idCriador);
    }

    public void associarProfissional(int idServico, int idProfissional) {
        Servico servico = repositorioServico.buscarPorId(idServico);
        if (servico != null) {
            servico.adicionarProfissional(idProfissional);
            System.out.println("Profissional de ID " + idProfissional + " foi associado ao serviço '" + servico.getNome() + "'");
        } else {
            System.out.println("Serviço com ID " + idServico + " não encontrado.");
        }
    }

    public void removerAssociacao(int idServico, int idProfissional) {
        Servico servico = repositorioServico.buscarPorId(idServico);
        if (servico != null) {
            servico.removerProfissional(idProfissional);
            System.out.println("Profissional de ID " + idProfissional + " removido do serviço '" + servico.getNome() + "'");
        } else {
            System.out.println("Serviço não encontrado.");
        }
    }

    public void listarServicos() {
        List<Servico> servicos = repositorioServico.listar();
        if (servicos.isEmpty()) {
            System.out.println("Nenhum serviço cadastrado ainda.");
        } else {
            System.out.println("Lista de serviços cadastrados:");
            for (Servico s : servicos) {
                System.out.println(s);
            }
        }
    }

    public void listarServicosPorProfissional(int idProfissional) {
        List<Servico> servicos = repositorioServico.listarPorProfissional(idProfissional);
        if (servicos.isEmpty()) {
            System.out.println("Nenhum serviço associado ao profissional de ID " + idProfissional);
        } else {
            System.out.println("Serviços do profissional " + idProfissional + ":");
            for (Servico s : servicos) {
                System.out.println(s);
            }
        }
    }
}
