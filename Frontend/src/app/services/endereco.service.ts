import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnderecoModel } from '../model/endereco.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class EnderecoService {
  private readonly API_URL = `${environment.apiUrl}/enderecos`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  salvar(endereco: EnderecoModel): Observable<EnderecoModel> {
    return this.http.post<EnderecoModel>(
      this.API_URL,
      endereco,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  listar(): Observable<EnderecoModel[]> {
    return this.http.get<EnderecoModel[]>(
      this.API_URL,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorId(id: string): Observable<EnderecoModel> {
    return this.http.get<EnderecoModel>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  alterar(endereco: EnderecoModel): Observable<EnderecoModel> {
      return this.http.put<EnderecoModel>(
        `${this.API_URL}/${endereco.id}`,
        endereco,
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
