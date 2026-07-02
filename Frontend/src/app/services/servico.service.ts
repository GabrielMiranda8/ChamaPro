import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServicoModel } from '../model/servico.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ServicoService {
  private readonly API_URL = `${environment.apiUrl}/servicos`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  salvar(servico: ServicoModel): Observable<ServicoModel> {
    return this.http.post<ServicoModel>(
      this.API_URL,
      servico,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  listar(): Observable<ServicoModel[]> {
    return this.http.get<ServicoModel[]>(
      this.API_URL,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorId(id: string): Observable<ServicoModel> {
    return this.http.get<ServicoModel>(
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