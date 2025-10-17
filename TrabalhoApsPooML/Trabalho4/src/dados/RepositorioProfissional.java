package dados;
import java.util.ArrayList;
import java.util.List;
import model.Profissional;

public class RepositorioProfissional {
    protected List<Profissional> profissionais;
    protected int quantPro;

    public RepositorioProfissional(){

    }

    public void Add(Profissional p){
        contarProfissional();
        if (p != null){
            profissionais.add(p);
        }
    }

    public void Excluir(int id){
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            if (profissionais.get(i).getId() == id)
            profissionais.remove(profissionais.get(i));
        }
    }

    public void Alterar(int id){
        contarProfissional();
        for (int i = 0; i < quantPro; i++) {
            if (profissionais.get(i).getId() == id){
                
            }
        }
    }

    protected void contarProfissional() {
		quantPro = 0;
		for (int i = 0; i < profissionais.size(); i++) {
			if (profissionais.get(i) != null) {
				quantPro++;
			}
		}
	}

}
