package control;

import java.util.List;

import model.Profissional;
import model.Servico;

public class Sistema {
    private ControleCaracteristica cCaracteristica;
    private ControleProfissional cProfissional;
    private ControleServico cServico;
    private ControleUsuario cUsuario;

    private static Sistema instance;

    private Sistema() {
        cCaracteristica = new ControleCaracteristica();
        cProfissional = new ControleProfissional();
        cServico = new ControleServico(); // construtor padrão em ControleServico
        cUsuario = new ControleUsuario();
        init();
    }

    // singleton
    public static Sistema getInstance() {
        if (instance == null)
            instance = new Sistema();
        return instance;
    }

    public ControleServico getControleServico() {
        return cServico;
    }

    public ControleCaracteristica getControleCaracteristica() {
        return cCaracteristica;
    }

    public void init() {
        cProfissional.Add("lelis@gmail.com", "Henrique", "123", 5, 7, 2007, "111.111.111-11");
        cProfissional.Add("gabriel@gmail.com", "Gabriel", "123", 12, 6, 2009, "222.222.222-22");

        cServico.cadastrarServico("Pedreiro", "Construções", 1000, cProfissional.BuscarPorId(1));
        cServico.cadastrarServico("Babá", "Cuida de crianças", 300, cProfissional.BuscarPorId(2));
    }

    // PROFISSIONAL
    public void Add(String email, String nome, String senha, int dia, int mes, int ano, String cpf) {
        cProfissional.Add(email, nome, senha, dia, mes, ano, cpf);
    }

    public void ExcluirProfissional(int id) {
        cProfissional.Excluir(id);
        cServico.DesassociarProfissionalDeServicos(id);
        Profissional p = cProfissional.BuscarPorId(id);
        cCaracteristica.removerAssociacao(id, p);
    }

    public void Alterar(int id, String email, String nome, String senha, int dia, int mes, int ano, String cpf) {
        cProfissional.Alterar(id, email, nome, senha, dia, mes, ano, cpf);
    }

    public List<Profissional> ListarTodos() {
        return cProfissional.ListarTodos();
    }

    public void AssociarServico(int idProfissional, int idServico) {
        Servico s = cServico.buscarPorId(idServico);
        if (s != null) {
            cProfissional.AssociarServico(idProfissional, s);
            Profissional p = cProfissional.BuscarPorId(idProfissional);
            if (p != null)
                cServico.AssociarProfissional(idServico, p);
        }

    }

    public void DesassociarServico(int idProfissional, int idServico) {
        cProfissional.DesassociarServico(idProfissional, idServico);
        DesassociarProfissional(idServico, idProfissional);
    }

    public String ListarServicosDeProfissional(int id) {
        return cProfissional.ListarServicos(id);
    }

    public String ListarCaracteristicasDeProfissional(int id){
        return cProfissional.ListarCaracteristicas(id);
    }

    public Profissional BuscarPorId(int id) {
        return cProfissional.BuscarPorId(id);
    }

    // SERVICO
    public void CadastrarServico(String nome, String descricao, double preco, int id) {
        if (cProfissional.repoProfissional.idExiste(id)) {
            Profissional profissional = cProfissional.BuscarPorId(id);
            cServico.cadastrarServico(nome, descricao, preco, profissional);
        } else {
            System.out.println("Profissional não existe com id: " + id);
        }
    }

    public void ExcluirServico(int id) {
        cServico.removerServico(id);
        cProfissional.RemoverServico(id);
    }

    public void AlterarServico(Servico servicoAtualizado) {
        cServico.atualizarServico(servicoAtualizado);
    }

    public List<Servico> ListarServicos() {
        return cServico.listarServicos();
    }

    public ControleServico getCServico() {
        return cServico;
    }

    public String ListarProfissionaisDeServico(int id) {
        return cServico.ListarProfissioais(id);
    }

    public void AssociarProfissional(int idServico, int idProfissional) {
        Profissional p = cProfissional.BuscarPorId(idProfissional);
        Servico s = cServico.buscarPorId(idServico);
        if (p != null && s != null)
            cServico.AssociarProfissional(idServico, p);
    }

    public void DesassociarProfissional(int idServico, int idProfissional) {
        Profissional p = cProfissional.BuscarPorId(idProfissional);
        Servico s = cServico.buscarPorId(idServico);
        if (p != null && s != null)
            cServico.DesassociarProfissional(idProfissional, p);
    }

    // CARACTERÍSTICA
    


    public String ListarProfissioaisDeCaracteristica(int id) {
        return cCaracteristica.ListarProfissioais(id);
    }
}
