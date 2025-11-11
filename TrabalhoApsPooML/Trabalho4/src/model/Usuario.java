package model;

public abstract class Usuario  {
    protected int id;
    protected String email;
    protected String nome;
    protected String senha;
    protected String data;
    protected String cpf;

    public static int geraId = 1;

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public void setData(String data) {
        this.data = data;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

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

    public String getData() {
        return data;
    }

    public String getCpf() {
        return cpf;
    }

    protected Usuario(String email, String nome, String senha, String data, String cpf){
        this.id = geraId++;
        this.email = email;
        this.nome = nome;
        this.senha = senha;
        this.data = data;
        this.cpf = cpf;
    }
    
    protected Usuario(Usuario outro){
        this.id = outro.id;
        this.email = outro.email;
        this.nome = outro.nome;
        this.senha = outro.senha;
        this.data = outro.data;
        this.cpf = outro.cpf;
    }
}
