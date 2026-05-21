import { Injectable } from '@angular/core';
import { CaracteristicaModel } from '../model/caracteristica.model';
@Injectable({
  providedIn: 'root',
})
export class CaracteristicaService {
  salvar(caracteristica: CaracteristicaModel): CaracteristicaModel {
    let caracteristicas = JSON.parse(localStorage.getItem('caracteristicas') || '[]');
    if (caracteristica.id === "") {
      let carac = new CaracteristicaModel();
      carac = caracteristicas.find((temp: CaracteristicaModel) => temp.nome === caracteristica.nome);
      if (!carac) {
        caracteristica.id = crypto.randomUUID();
        caracteristicas.push(caracteristica);
      }
    } else {
      let posicao = caracteristicas.findIndex((temp: CaracteristicaModel) => temp.id === caracteristica.id);
      caracteristicas[posicao] = caracteristica;
    }
    localStorage.setItem('caracteristicas', JSON.stringify(caracteristicas));
    return caracteristica;
  }


  listar(): CaracteristicaModel[] {
    let caracteristicas = JSON.parse(localStorage.getItem('caracteristicas') || '[]');
    return caracteristicas;
  }

  buscarPorId(id: string): CaracteristicaModel {
    let caracteristicas = JSON.parse(localStorage.getItem('caracteristicas') || '[]');
    let caracteristica = new CaracteristicaModel();
    caracteristica = caracteristicas.find((temp: CaracteristicaModel) => temp.id === id);
    return caracteristica;
  }

  excluir() {

    return true;
  }
}
