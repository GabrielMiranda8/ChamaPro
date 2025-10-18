package model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Servico {
    private int id;
    private String nome;
    private String descricao;
    private double preco;
    private List<Profissional> profissionais;

    public Servico(int id, String nome, String descricao, double preco, Profissional criador) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.profissionais = new ArrayList<>();
        if (criador != null) {
            adicionarProfissional(criador);
        }
    }

    public Servico(Servico outro) {
        if (outro == null)
            return;
        this.id = outro.id;
        this.nome = outro.nome;
        this.descricao = outro.descricao;
        this.preco = outro.preco;
        this.profissionais = new ArrayList<>(outro.profissionais);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }

    public List<Profissional> getProfissionais() {
        return profissionais;
    }

    public void adicionarProfissional(Profissional profissional) {
        if (profissional == null)
            return;
        if (!profissionais.contains(profissional)) {
            profissionais.add(profissional);
            if (profissional.servicos == null) {
                profissional.servicos = new java.util.ArrayList<>();
            }
            if (!profissional.servicos.contains(this)) {
                profissional.servicos.add(this);
            }
        }
    }

    public void removerProfissional(Profissional profissional) {
        if (profissional == null)
            return;
        profissionais.remove(profissional);
        if (profissional.servicos != null) {
            profissional.servicos.remove(this);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Servico))
            return false;
        Servico servico = (Servico) o;
        return id == servico.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}