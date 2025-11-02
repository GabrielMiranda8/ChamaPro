package control;

import java.util.List;

import model.Caracteristica;
import model.Cliente;
import model.Profissional;
import model.Servico;

public class Sistema {
    protected ControleCaracteristica cCaracteristica;
    protected ControleProfissional cProfissional;
    protected ControleServico cServico;
    protected ControleUsuario cUsuario;
    protected ControleCliente cCliente;

    private static Sistema instance;

    protected Sistema() {
        cCaracteristica = new ControleCaracteristica();
        cProfissional = new ControleProfissional();
        cServico = new ControleServico();
        cUsuario = new ControleUsuario();
        cCliente = new ControleCliente();
        init();
    }

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

    // INICIALIZACAO
    public void init() {
        cProfissional.Add("henrique@gmail.com", "Henrique", "123", 5, 7, 2007, "202.479.140-96");
        cProfissional.Add("gabriel@gmail.com", "Gabriel", "123", 12, 6, 2009, "134.796.276-09");

        cCliente.Add("lelis@gmail.com", "Lelis", "123", 5, 7, 2007, "202.479.140-96", 1, "Ruazona", "Bairrozão",
                "Timóteo");
        cCliente.Add("miranda@gmail.com", "Miranda", "123", 12, 6, 2009, "134.796.276-09", 2, "Ruazinha", "Bairrozinho",
                "Coronel Fabriciano");

        cServico.cadastrarServico("Pedreiro", "Construções", 1000, cProfissional.BuscarPorId(1));
        cServico.cadastrarServico("Babá", "Cuida de crianças", 300, cProfissional.BuscarPorId(2));

        cCaracteristica.cadastrarCaracteristica("Cego", "Não enxerga", cProfissional.BuscarPorId(1));
        cCaracteristica.cadastrarCaracteristica("Cadeirante", "Usa cadeira de rodas", cProfissional.BuscarPorId(2));
    }

    // PROFISSIONAL
    public String Add(String email, String nome, String senha, int dia, int mes, int ano, String cpf) {
        return (cProfissional.Add(email, nome, senha, dia, mes, ano, cpf));
    }

    public String ExcluirProfissional(int id) {
        Profissional p = cProfissional.BuscarPorId(id);
        if (p == null) {
            return ("Profissional não encontrado.");
        }

        cServico.DesassociarProfissionalDeServicos(id);

        cCaracteristica.removerProfissionalDeTodasCaracteristicas(p);

        cProfissional.Excluir(id);

        return ("Profissional excluído com sucesso.");
    }

    public String Alterar(int id, String email, String nome, String senha, int dia, int mes, int ano, String cpf) {
        return (cProfissional.Alterar(id, email, nome, senha, dia, mes, ano, cpf));
    }

    public List<Profissional> ListarTodos() {
        return cProfissional.ListarTodos();
    }

    public String AssociarServico(int idProfissional, int idServico) {
        Servico s = cServico.buscarPorId(idServico);
        if (s != null) {
            Profissional p = cProfissional.BuscarPorId(idProfissional);
            if (p != null)
                cServico.AssociarProfissional(idServico, p);
            return (cProfissional.AssociarServico(idProfissional, s));
        }
        return ("Serviço não associado.");
    }

    public String DesassociarServico(int idProfissional, int idServico) {
        DesassociarProfissional(idServico, idProfissional);
        return (cProfissional.DesassociarServico(idProfissional, idServico));
    }

    public String DesassociarCaracteristica(int idProfissional, int idCaracteristica) {
        cProfissional.DesassociarCaracteristica(idProfissional, idCaracteristica);
        return (cCaracteristica.removerAssociacao(idCaracteristica, cProfissional.BuscarPorId(idProfissional)));
    }

    public String ListarServicosDeProfissional(int id) {
        return cProfissional.ListarServicos(id);
    }

    public String ListarCaracteristicasDeProfissional(int id) {
        return cProfissional.ListarCaracteristicas(id);
    }

    public Profissional BuscarPorId(int id) {
        return cProfissional.BuscarPorId(id);
    }

    public void RemoverCaracteristicaProfissional(int idCaracteristica) {
        cProfissional.RemoverCaracteristica(idCaracteristica);
    }

    // CLIENTE
    public String CadastrarCliente(String email, String nome, String senha, int dia, int mes, int ano, String cpf,
            int numero,
            String rua, String bairro, String cidade) {
        return (cCliente.Add(email, nome, senha, dia, mes, ano, cpf, numero, rua, bairro, cidade));
    }

    public String ExcluirCliente(int id) {
        Cliente c = cCliente.BuscarPorId(id);
        if (c == null) {
            return ("Cliente não encontrado.");
        }

        cCaracteristica.removerClienteDeTodasCaracteristicas(c);

        cCliente.Excluir(id);

        return ("Cliente excluído com sucesso.");
    }

    public String AlterarCliente(int id, String email, String nome, String senha, int dia, int mes, int ano, String cpf,
            int numero,
            String rua, String bairro, String cidade) {
        return (cCliente.Alterar(id, email, nome, senha, dia, mes, ano, cpf, numero,
                rua, bairro, cidade));
    }

    public List<Cliente> ListarTodosClientes() {
        return cCliente.ListarTodos();
    }

    public Cliente BuscarClientePorId(int id) {
        return cCliente.BuscarPorId(id);
    }

    // agora retorna mensagem e mantém ambas as estruturas atualizadas
    public String AssociarCaracteristica(int idCliente, int idCaracteristica) {
        Caracteristica c = cCaracteristica.buscarPorId(idCaracteristica);
        if (c != null) {
            cCliente.AssociarCaracteristica(idCliente, c);
            Cliente cliente = cCliente.BuscarPorId(idCliente);
            if (cliente != null) {
                c.adicionarCliente(cliente);
                return ("Característica associada ao cliente.");
            } else {
                return ("Cliente não encontrado.");
            }
        }
        return ("Característica não encontrada.");
    }

    public String DesassociarCaracteristicaDeCliente(int idCliente, int idCaracteristica) {
        Cliente cliente = cCliente.BuscarPorId(idCliente);
        if (cliente == null) {
            return ("Cliente não encontrado.");
        }
        cCliente.DesassociarCaracteristica(idCliente, idCaracteristica);
        Caracteristica c = cCaracteristica.buscarPorId(idCaracteristica);
        if (c != null) {
            c.removerCliente(cliente);
        }
        return ("Característica desassociada.");
    }

    public String ListarCaracteristicasDeCliente(int id) {
        return cCliente.ListarCaracteristicas(id);
    }

    public void RemoverCaracteristicaCliente(int idCaracteristica) {
        cCliente.RemoverCaracteristica(idCaracteristica);
    }

    // expõe listagem de clientes de uma característica para UI
    public String ListarClientesDeCaracteristica(int id) {
        return cCaracteristica.ListarClientes(id);
    }

    // SERVICO
    public String CadastrarServico(String nome, String descricao, double preco, int id) {
        if (cProfissional.repoProfissional.idExiste(id)) {
            Profissional profissional = cProfissional.BuscarPorId(id);
            return cServico.cadastrarServico(nome, descricao, preco, profissional);
        } else {
            return ("Profissional não existe com id: " + id);
        }
    }

    public String ExcluirServico(int id) {
        cProfissional.RemoverServico(id);
        return (cServico.removerServico(id));
    }

    public void AlterarServico(Servico servicoAtualizado) {
        cServico.atualizarServico(servicoAtualizado);
        cProfissional.atualizarServico(servicoAtualizado);
    }

    public List<Servico> ListarServicos() {
        return cServico.listarServicos();
    }

    public ControleServico getCServico() {
        return cServico;
    }

    public Servico servicoExiste(int id) {
        return cServico.servicoExiste(id);
    }

    public String ListarProfissionaisDeCaracteristica(int id) {
        return cCaracteristica.ListarProfissioais(id);
    }

    public String ListarProfissionaisDeServico(int id) {
        return cServico.ListarProfissioais(id);
    }

    // SERVICO / PROFISSIONAL
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

    // CARACTERISTICA
    public String ListarProfissioaisDeCaracteristica(int id) {
        return cCaracteristica.ListarProfissioais(id);
    }
}