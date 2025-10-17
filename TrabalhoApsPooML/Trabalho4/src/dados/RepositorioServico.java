package dados;
import java.util.ArrayList;
import java.util.List;
import model.Servico;

public class RepositorioServico {
    protected List<Servico> servicos;
    protected int quantSer;

    public RepositorioServico(){

    }

    public void Add(Servico s){
        contarServico();
        if (s != null){
            servicos.add(s);
        }
    }

    public void Excluir(int id){
        contarServico();
        for (int i = 0; i < quantSer; i++) {
            if (servicos.get(i).getId() == id)
            servicos.remove(servicos.get(i));
        }
    }

    public void Alterar(int id){
        contarServico();
        for (int i = 0; i < quantSer; i++) {
            if (servicos.get(i).getId() == id){
                
            }
        }
    }

    protected void contarServico() {
		quantSer = 0;
		for (int i = 0; i < servicos.size(); i++) {
			if (servicos.get(i) != null) {
				quantSer++;
			}
		}
	}

}

