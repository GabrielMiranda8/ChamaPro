package model;

public class Servico {
    private int id;
    private String nome;
    private String descricao;
    private double preco;
    private Profissional profissional;

    public static int geraId = 1;

    public Servico(String nome, String descricao, double preco, Profissional profissional) {
        this.id = geraId++;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.profissional = profissional;
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

    public Profissional getProfissional() {
        return profissional;
    }

    public void setProfissional(Profissional profissional) {
        this.profissional = profissional;
    }

    @Override
    public String toString() {
        return "Serviço: " + nome +
                " Descrição: " + descricao +
                " Preço: R$" + preco +
                " Profissional: " + profissional.getNome();
    }
}
