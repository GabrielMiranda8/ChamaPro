package dados;

import java.util.ArrayList;
import java.util.List;

import model.Date;
import model.Profissional;
import model.Servico;

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
                profissionais.remove(i);
            contarProfissional();
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

    public boolean ServicoExiste(int idProfissional, int idServico) {
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            if (profissionais.get(i).getId() == idProfissional) {
                for (int j = 0; j < profissionais.get(i).getServicos().size(); j++) {
                    if (profissionais.get(i).getServicos().get(j).getId() == idServico)
                        return true;
                }
            }

        }
        return false;
    }

    public boolean CaracteristicaExiste(int idProfissional, int idCaracteristica) {
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            if (profissionais.get(i).getId() == idProfissional) {
                for (int j = 0; j < profissionais.get(i).getCaracteristicas().size(); j++) {
                    if (profissionais.get(i).getCaracteristicas().get(j).getId() == idCaracteristica)
                        return true;
                }
            }

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

    public Profissional buscarPorId(int id) {
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            if (profissionais.get(i).getId() == id)
                return new Profissional(profissionais.get(i));
        }
        return null;
    }

    public void AssociarServico(int id, Servico s) {
        if (idExiste(id)) {
            contarProfissional();
            for (int i = 0; i < quantPro; i++) {
                if (profissionais.get(i).getId() == id) {
                    profissionais.get(i).getServicos().add(s);
                }
            }
        }
    }

    public void DesassociarServico(int idProfissional, int idServico) {
        if (idExiste(idProfissional)) {
            contarProfissional();
            for (int i = 0; i < quantPro; i++) {
                if (profissionais.get(i).getId() == idProfissional) {
                    for (int j = 0; j < profissionais.get(i).getServicos().size(); j++) {
                        if (profissionais.get(i).getServicos().get(j).getId() == idServico)
                            profissionais.get(i).getServicos().remove(j);
                    }
                }
            }
        }
    }

    public void DesassociarCaracteristica(int idProfissional, int idCaracteristica) {
        if (idExiste(idProfissional)) {
            contarProfissional();
            for (int i = 0; i < quantPro; i++) {
                if (profissionais.get(i).getId() == idProfissional) {
                    for (int j = 0; j < profissionais.get(i).getCaracteristicas().size(); j++) {
                        if (profissionais.get(i).getCaracteristicas().get(j).getId() == idCaracteristica)
                            profissionais.get(i).getCaracteristicas().remove(j);
                    }
                }
            }
        }
    }

    public void RemoverCaracteristica(int idCaracteristica) {
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            DesassociarCaracteristica(profissionais.get(i).getId(), idCaracteristica);
        }
    }

    public void RemoverServico(int idServico) {
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            DesassociarServico(profissionais.get(i).getId(), idServico);
        }
    }

    public String ListarServicos(int id) {
        String servicos = "";
        if (idExiste(id)) {
            contarProfissional();
            for (int i = 0; i < quantPro; i++) {
                if (profissionais.get(i).getId() == id) {
                    for (int j = 0; j < profissionais.get(i).getServicos().size(); j++) {
                        if (j + 1 < profissionais.get(i).getServicos().size())
                            servicos += profissionais.get(i).getServicos().get(j).getNome() + ", ";
                        else
                            servicos += profissionais.get(i).getServicos().get(j).getNome();
                    }
                }
            }
        }
        return servicos;
    }

    public String ListarCaracteristicas(int id) {
        String caracteristicas = "";
        if (idExiste(id)) {
            contarProfissional();
            for (int i = 0; i < quantPro; i++) {
                if (profissionais.get(i).getId() == id) {
                    for (int j = 0; j < profissionais.get(i).getCaracteristicas().size(); j++) {
                        if (j + 1 < profissionais.get(i).getCaracteristicas().size())
                            caracteristicas += profissionais.get(i).getCaracteristicas().get(j).getNome() + ", ";
                        else
                            caracteristicas += profissionais.get(i).getCaracteristicas().get(j).getNome();
                    }
                }
            }
        }
        return caracteristicas;
    }

    public static boolean ValidarCPF(String cpf) {
        if (cpf == null)
            return false;
        String numeros = "";
        for (int i = 0; i < cpf.length(); i++) {
            char c = cpf.charAt(i);
            if (c >= '0' && c <= '9') {
                numeros += c;
            }
        }
        cpf = numeros;

        if (cpf.length() != 11)
            return false;

        boolean repetido = true;
        for (int i = 1; i < cpf.length(); i++) {
            if (cpf.charAt(i) != cpf.charAt(0)) {
                repetido = false;
                break;
            }
        }
        if (repetido)
            return false;

        // o '0' é pra subtrair em ascii o valor dos digitos
        int soma = 0;
        for (int i = 0; i < 9; i++) {
            soma = soma + (cpf.charAt(i) - '0') * (10 - i);
        }

        int resto = soma % 11;
        int digito1;
        if (resto < 2) {
            digito1 = 0;
        } else {
            digito1 = 11 - resto;
        }

        soma = 0;
        for (int i = 0; i < 10; i++) {
            soma = soma + (cpf.charAt(i) - '0') * (11 - i);
        }

        resto = soma % 11;
        int digito2;
        if (resto < 2) {
            digito2 = 0;
        } else {
            digito2 = 11 - resto;
        }

        if (digito1 == (cpf.charAt(9) - '0') && digito2 == (cpf.charAt(10) - '0')) {
            return true;
        } else {
            return false;
        }
    }
}
