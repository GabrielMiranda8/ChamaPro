package model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Caracteristica {
    private int id;
    private String nome;
    private String descricao;
    private List<Profissional> profissionais;

    public Caracteristica(int id, String nome, String descricao, Profissional criador) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.profissionais = new ArrayList<>();
        if (criador != null) {
            adicionarProfissional(criador);
        }
    }

    public Caracteristica(Caracteristica outro) {
        if (outro == null) return;
        this.id = outro.id;
        this.nome = outro.nome;
        this.descricao = outro.descricao;
        this.profissionais = new ArrayList<>(outro.profissionais);
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public List<Profissional> getProfissionais() { return profissionais; }

    public void adicionarProfissional(Profissional profissional) {
        if (profissional == null) return;
        if (!profissionais.contains(profissional)) {
            profissionais.add(profissional);
            if (profissional.caracteristicas == null) {
                profissional.caracteristicas = new ArrayList<>();
            }
            if (!profissional.caracteristicas.contains(this)) {
                profissional.caracteristicas.add(this);
            }
        }
    }

    public void removerProfissional(Profissional profissional) {
        if (profissional == null) return;
        profissionais.remove(profissional);
        if (profissional.caracteristicas != null) {
            profissional.caracteristicas.remove(this);
        }
    }

    @Override
    public String toString() {
        String resultado = "";
        resultado += id + " - " + nome;
        resultado += " | " + descricao;
        resultado += " | Prof.: ";
        if (profissionais.isEmpty()) {
            resultado += "nenhum";
        } else {
            String lista = "";
            for (Profissional p : profissionais) {
                if (p != null) {
                    lista += p.getNome() + "(" + p.getId() + "), ";
                }
            }
            if (lista.endsWith(", ")) {
                lista = lista.substring(0, lista.length() - 2);
            }
            resultado += lista;
        }
        return resultado;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Caracteristica)) return false;
        Caracteristica that = (Caracteristica) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
