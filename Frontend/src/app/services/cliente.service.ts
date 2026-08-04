import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClienteModel } from '../model/cliente.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly API_URL = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  listar(): Observable<ClienteModel[]> {
    return this.http.get<ClienteModel[]>(
      this.API_URL,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    );
  }

  buscarPorId(id: string): Observable<ClienteModel> {
    return this.http.get<ClienteModel>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    );
  }

  criar(id: string): Observable<ClienteModel> {
    return this.http.post<ClienteModel>(
      this.API_URL,
      { id },
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    );
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    );
  }
}
