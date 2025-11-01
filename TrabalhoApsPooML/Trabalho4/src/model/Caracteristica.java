package model;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

public class Caracteristica {
    private int id;
    private String nome;
    private String descricao;
    private List<Profissional> profissionais;
    private List<Cliente> clientes;

    public Caracteristica(int id, String nome, String descricao, Profissional criador) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.profissionais = new ArrayList<Profissional>();
        this.clientes = new ArrayList<Cliente>();
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
        for (Profissional p : profissionais) {
            if (p != null && p.getId() == profissional.getId()) {
                return;
            }
        }
        profissionais.add(profissional);

        if (profissional.getCaracteristicas() == null) {
            try {
                profissional.caracteristicas = new ArrayList<>();
            } catch (Throwable t) {
            }
        }
        boolean existe = false;
        for (Caracteristica c : profissional.getCaracteristicas()) {
            if (c != null && c.getId() == this.id) {
                existe = true;
                break;
            }
        }
        if (!existe) {
            profissional.getCaracteristicas().add(this);
        }
    }

    public void removerProfissional(Profissional profissional) {
        if (profissional == null) return;
        Iterator<Profissional> it = profissionais.iterator();
        while (it.hasNext()) {
            Profissional p = it.next();
            if (p != null && p.getId() == profissional.getId()) {
                it.remove();
            }
        }
        if (profissional.getCaracteristicas() != null) {
            Iterator<Caracteristica> itc = profissional.getCaracteristicas().iterator();
            while (itc.hasNext()) {
                Caracteristica c = itc.next();
                if (c != null && c.getId() == this.id) {
                    itc.remove();
                }
            }
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
