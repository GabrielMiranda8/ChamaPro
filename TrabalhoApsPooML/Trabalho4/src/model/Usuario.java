package model;

public class Usuario {
    protected int id;
    protected String email;
    protected String nome;
    protected String senha;
    protected Date data;
    protected String cpf;

    public int getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getNome() {
        return nome;
    }

    public String getSenha() {
        return senha;
    }

    public Date getData() {
        return data;
    }

    public String getCpf() {
        return cpf;
    }

    public static int geraId = 1;

    protected Usuario(String email, String nome, String senha, Date data, String cpf){
        this.id = geraId++;
        this.email = email;
        this.nome = nome;
        this.senha = senha;
        this.data = data;
        this.cpf = cpf;
    }
}
