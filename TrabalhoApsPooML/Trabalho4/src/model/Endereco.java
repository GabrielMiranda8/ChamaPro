package model;

public class Endereco {
    protected int numero;
    protected String rua;
    protected String bairro;
    protected String cidade;

    private Endereco(int numero, String rua, String bairro, String cidade) {
        this.numero = numero;
        this.rua = rua;
        this.bairro = bairro;
        this.cidade = cidade;
    }

    public static Endereco getInstance(int numero, String rua, String bairro, String cidade) {
        if (numero > 0 && rua != null && bairro != null && cidade != null)
            return new Endereco(numero, rua, bairro, cidade);
        return null;
    }

    public int getNumero() {
        return numero;
    }

    public String getRua() {
        return rua;
    }

    public String getBairro() {
        return bairro;
    }

    public String getCidade() {
        return cidade;
    }
}
