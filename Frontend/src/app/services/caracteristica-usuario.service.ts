import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CaracteristicaUsuarioModel } from '../model/caracteristica-usuario.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class CaracteristicaUsuarioService {
  private readonly API_URL = `${environment.apiUrl}/caracteristicausuario`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  // Backend devolve caracteristicaId/caracteristicaNome/usuarioId (nomes
  // diferentes do nosso model) — convertemos aqui, igual já é feito em
  // profissional-servico.service.ts.
  private converterData(cu: any): CaracteristicaUsuarioModel {
    return {
      ...cu,
      idUsuario: cu.usuarioId,
      idCaracteristica: cu.caracteristicaId,
      caracteristicaNome: cu.caracteristicaNome,
    };
  }

  listarPorUsuario(idUsuario: string): Observable<CaracteristicaUsuarioModel[]> {
    return this.http.get<CaracteristicaUsuarioModel[]>(
      `${this.API_URL}/usuario/${idUsuario}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    ).pipe(map(res => res.map(cu => this.converterData(cu))));
  }

  salvar(cu: CaracteristicaUsuarioModel): Observable<CaracteristicaUsuarioModel> {
    const corpo = {
      idUsuario: cu.idUsuario,
      idCaracteristica: cu.idCaracteristica,
      tem: cu.tem,
      lida: cu.lida,
    };
    return this.http.post<CaracteristicaUsuarioModel>(
      this.API_URL,
      corpo,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    ).pipe(map(res => this.converterData(res)));
  }

  atualizar(id: string, cu: CaracteristicaUsuarioModel): Observable<CaracteristicaUsuarioModel> {
    const corpo = {
      idUsuario: cu.idUsuario,
      idCaracteristica: cu.idCaracteristica,
      tem: cu.tem,
      lida: cu.lida,
    };
    return this.http.put<CaracteristicaUsuarioModel>(
      `${this.API_URL}/${id}`,
      corpo,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    ).pipe(map(res => this.converterData(res)));
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    );
  }
}
