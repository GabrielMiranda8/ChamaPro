package model;

import java.util.ArrayList;
import java.util.List;

public class Profissional extends Usuario {
    protected List<Servico> servicos;
    protected List<Caracteristica> caracteristicas;

    private Profissional(String email, String nome, String senha, Date data, String cpf) {
        super(email, nome, senha, data, cpf);
        this.servicos = new ArrayList<Servico>();
        this.caracteristicas = new ArrayList<Caracteristica>();
    }

    public Profissional(Profissional outro) {
        super(outro);
        this.id = outro.id;
        this.servicos = outro.servicos;
        this.caracteristicas = outro.caracteristicas;
    }

    public static Profissional getInstance(String email, String nome, String senha, Date data, String cpf) {
        if (email != null && nome != null && senha != null && data != null && cpf != null) {
            return new Profissional(email, nome, senha, data, cpf);
        }
        return null;
    }

    @Override
    public String toString() {
        return " " + this.id + " - " + this.nome;
    }

    public List<Servico> getServicos() {
        return servicos;
    }

}
