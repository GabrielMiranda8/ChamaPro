package model;

public class Usuario {
    protected int id;
    protected String email;
    protected String nome;
    protected String senha;
    protected Date data;
    protected String cpf;

    public static int geraId = 1;

    private Usuario(String email, String nome, String senha, Date data, String cpf){
        this.id = geraId++;
    }

    public Usuario getInstance(String email, String nome, String senha, Date data, String cpf){
        if (email != null && nome != null && senha != null && data != null && cpf != null){
            return new Usuario(email, nome, senha, data, cpf);
        }
        return null;
    }
}
