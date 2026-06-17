import { Injectable } from '@angular/core';
import { ProfissionalServicoModel } from '../model/profissional-servico.model';

@Injectable({
  providedIn: 'root',
})
export class ProfissionalServicoService {
  salvar(ps: ProfissionalServicoModel): ProfissionalServicoModel {
    let pss = JSON.parse(localStorage.getItem('profissional_servico') || '[]');
    if (ps.id === "") {
      let ps2 = new ProfissionalServicoModel();
      ps2 = pss.find((temp: ProfissionalServicoModel) => temp.id === ps.id);
      if (!ps2) {
        ps.id = crypto.randomUUID();
        pss.push(ps);
      }
    } else {
      let posicao = pss.findIndex((temp: ProfissionalServicoModel) => temp.id === ps.id);
      pss[posicao] = ps;
    }
    localStorage.setItem('profissional_servico', JSON.stringify(pss));
    return ps;
  }


  listar(): ProfissionalServicoModel[] {
    let pss = JSON.parse(localStorage.getItem('profissional_servico') || '[]');
    return pss;
  }

  buscarPorId(id: string): ProfissionalServicoModel {
    let pss = JSON.parse(localStorage.getItem('profissional_servico') || '[]');
    let servico = new ProfissionalServicoModel();
    servico = pss.find((temp: ProfissionalServicoModel) => temp.id === id);
    return servico;
  }

  buscarPorProfissional(id: string): ProfissionalServicoModel[] {
    return this.listar().filter(ps => ps.idProfissional === id);
  }

  buscarPorServico(id: string): ProfissionalServicoModel[] {
    return this.listar().filter(ps => ps.idServico === id);
  }

  excluir() {
    // fazer exclusao
    return true;
  }
}
