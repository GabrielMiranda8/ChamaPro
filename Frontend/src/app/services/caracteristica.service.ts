import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CaracteristicaModel } from '../model/caracteristica.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class CaracteristicaService {
  private readonly API_URL = `${environment.apiUrl}/caracteristicas`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  salvar(caracteristica: CaracteristicaModel): Observable<CaracteristicaModel> {
    return this.http.post<CaracteristicaModel>(
      this.API_URL,
      caracteristica,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  listar(): Observable<CaracteristicaModel[]> {
    return this.http.get<CaracteristicaModel[]>(
      this.API_URL,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorId(id: string): Observable<CaracteristicaModel> {
    return this.http.get<CaracteristicaModel>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }
}