package dados;

import java.util.ArrayList;
import java.util.List;
import model.Date;
import model.Profissional;

public class RepositorioProfissional {
    protected List<Profissional> profissionais = new ArrayList<Profissional>();
    protected int quantPro;

    public RepositorioProfissional() {

    }

    public void Add(Profissional p) {
        contarProfissional();
        if (p != null) {
            profissionais.add(p);
        }
    }

    public void Excluir(int id) {
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            if (profissionais.get(i).getId() == id)
                profissionais.remove(profissionais.get(i));
        }
    }

    public void Alterar(int id, String email, String nome, String senha, Date data, String cpf) {
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            if (profissionais.get(i).getId() == id) {
                profissionais.get(i).setCpf(cpf);
                profissionais.get(i).setData(data);
                profissionais.get(i).setEmail(email);
                profissionais.get(i).setNome(nome);
                profissionais.get(i).setSenha(senha);
            }
        }
    }

    public List<Profissional> ListarTodos() {
        contarProfissional();
        List<Profissional> lista = new ArrayList<Profissional>();

        for (int i = 0; i < quantPro; i++) {
            lista.add(new Profissional(profissionais.get(i)));
        }

        return lista;
    }

    public void contarProfissional() {
        quantPro = 0;
        for (int i = 0; i < profissionais.size(); i++) {
            if (profissionais.get(i) != null) {
                quantPro++;
            }
        }
    }

    public boolean idExiste(int id) {
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            if (profissionais.get(i).getId() == id)
                return true;
        }
        return false;
    }

    public boolean verificarRepetido(String email, String cpf) {
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            if (profissionais.get(i).getEmail().equals(email))
                return true;
            if (profissionais.get(i).getCpf().equals(cpf))
                return true;

        }
        return false;
    }

}
