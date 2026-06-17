import { Injectable } from '@angular/core';
import { ServicoModel } from '../model/servico.model';

@Injectable({
  providedIn: 'root',
})
export class ServicoService {
    salvar(servico: ServicoModel): ServicoModel {
      let servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      if (servico.id === "") {
        let carac = new ServicoModel();
        carac = servicos.find((temp: ServicoModel) => temp.nome === servico.nome);
        if (!carac) {
          servico.id = crypto.randomUUID();
          servicos.push(servico);
        }
      } else {
        let posicao = servicos.findIndex((temp: ServicoModel) => temp.id === servico.id);
        servicos[posicao] = servico;
      }
      localStorage.setItem('servicos', JSON.stringify(servicos));
      return servico;
    }
  
  
    listar(): ServicoModel[] {
      let servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      return servicos;
    }
  
    buscarPorId(id: string): ServicoModel {
      let servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      let servico = new ServicoModel();
      servico = servicos.find((temp: ServicoModel) => temp.id === id);
      return servico;
    }
  
    excluir() {
      // fazer exclusao
      return true;
    }
}
