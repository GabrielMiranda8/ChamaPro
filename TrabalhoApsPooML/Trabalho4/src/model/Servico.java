package model;

import java.util.ArrayList;
import java.util.List;

public class Servico {
    private int id;
    private String nome;
    private String descricao;
    private double preco;
    private List<Integer> idsProfissionais; 

    public Servico(int id, String nome, String descricao, double preco, int idCriador) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.idsProfissionais = new ArrayList<>();
        this.idsProfissionais.add(idCriador);
    }

    public int getId() {
        return id;
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

    public List<Integer> getIdsProfissionais() {
        return idsProfissionais;
    }

    public void adicionarProfissional(int idProfissional) {
        if (!idsProfissionais.contains(idProfissional)) {
            idsProfissionais.add(idProfissional);
        }
    }

    public void removerProfissional(int idProfissional) {
        idsProfissionais.remove(Integer.valueOf(idProfissional));
    }

    @Override
    public String toString() {
        return "Serviço: " + nome +
               " | Descrição: " + descricao +
               " | Preço: R$" + preco +
               " | IDs Profissionais: " + idsProfissionais;
    }
}
