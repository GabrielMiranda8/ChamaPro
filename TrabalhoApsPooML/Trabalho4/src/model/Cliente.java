package model;

import java.util.ArrayList;
import java.util.List;

public class Cliente extends Usuario {
    protected Endereco endereco;
    protected List<Caracteristica> caracteristicas;

    private Cliente(String email, String nome, String senha, Date data, String cpf, Endereco endereco) {
        super(email, nome, senha, data, cpf);
        this.endereco = endereco;
        this.caracteristicas = new ArrayList<Caracteristica>();
    }

    public Cliente(Cliente outro) {
        super(outro);
        this.id = outro.id;
        this.endereco = outro.endereco;
        this.caracteristicas = outro.caracteristicas;
    }

    public static Cliente getInstance(String email, String nome, String senha, Date data, String cpf,
            Endereco endereco) {
        if (email != null && nome != null && senha != null && data != null && cpf != null && endereco != null) {
            return new Cliente(email, nome, senha, data, cpf, endereco);
        }
        return null;
    }

    @Override
    public String toString() {
        return " " + this.id + " - " + this.nome;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public void setEndereco(Endereco endereco) {
        this.endereco = endereco;
    }

    public List<Caracteristica> getCaracteristicas() {
        return caracteristicas;
    }

}
