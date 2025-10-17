package model;

public class Servico {
    protected int id;
    protected String nome;
    protected String descricao;
    protected double precoMedio;

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

    public double getPrecoMedio() {
        return precoMedio;
    }

    public void setPrecoMedio(double precoMedio) {
        this.precoMedio = precoMedio;
    }

    public static void setGeraId(int geraId) {
        Servico.geraId = geraId;
    }

    public static int geraId = 1;

    protected Servico(String nome, String descricao, double precoMedio){
        this.id = geraId++;
        this.nome = nome;
        this.descricao = descricao;;
        this.precoMedio = precoMedio;
    }
}
