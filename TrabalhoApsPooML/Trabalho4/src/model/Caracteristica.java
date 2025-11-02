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

    // copia profundas das listas (novas listas com objetos de referência)
    public Caracteristica(Caracteristica outro) {
        if (outro == null) return;
        this.id = outro.id;
        this.nome = outro.nome;
        this.descricao = outro.descricao;
        this.profissionais = new ArrayList<>(outro.profissionais == null ? new ArrayList<>() : outro.profissionais);
        this.clientes = new ArrayList<>(outro.clientes == null ? new ArrayList<>() : outro.clientes);
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public List<Profissional> getProfissionais() { return profissionais; }

    public List<Cliente> getClientes() { return clientes; }

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

    // --- CLIENTE: métodos para manter associação bidirecional ---
    public void adicionarCliente(Cliente cliente) {
        if (cliente == null) return;
        for (Cliente cl : clientes) {
            if (cl != null && cl.getId() == cliente.getId()) {
                return;
            }
        }
        clientes.add(cliente);

        if (cliente.getCaracteristicas() == null) {
            try {
                cliente.caracteristicas = new ArrayList<>();
            } catch (Throwable t) {
            }
        }
        boolean existe = false;
        for (Caracteristica c : cliente.getCaracteristicas()) {
            if (c != null && c.getId() == this.id) {
                existe = true;
                break;
            }
        }
        if (!existe) {
            cliente.getCaracteristicas().add(this);
        }
    }

    public void removerCliente(Cliente cliente) {
        if (cliente == null) return;
        Iterator<Cliente> it = clientes.iterator();
        while (it.hasNext()) {
            Cliente cl = it.next();
            if (cl != null && cl.getId() == cliente.getId()) {
                it.remove();
            }
        }
        if (cliente.getCaracteristicas() != null) {
            Iterator<Caracteristica> itc = cliente.getCaracteristicas().iterator();
            while (itc.hasNext()) {
                Caracteristica c = itc.next();
                if (c != null && c.getId() == this.id) {
                    itc.remove();
                }
            }
        }
    }
    // --- fim cliente ---

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