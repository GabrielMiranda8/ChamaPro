import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AvaliacaoModel } from '../model/avaliacao.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AvaliacaoService {
  private readonly API_URL = `${environment.apiUrl}/avaliacoes`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  salvar(avaliacao: AvaliacaoModel): Observable<AvaliacaoModel> {
    return this.http.post<AvaliacaoModel>(
      this.API_URL,
      avaliacao,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  listar(): Observable<AvaliacaoModel[]> {
    return this.http.get<AvaliacaoModel[]>(
      this.API_URL,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorId(id: string): Observable<AvaliacaoModel> {
    return this.http.get<AvaliacaoModel>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  alterar(avaliacao: AvaliacaoModel): Observable<AvaliacaoModel> {
    return this.http.put<AvaliacaoModel>(
      `${this.API_URL}/${avaliacao.id}`,
      avaliacao,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorAutor(idAutor: string): Observable<AvaliacaoModel[]> {
    return this.http.get<AvaliacaoModel[]>(
      `${this.API_URL}/autor/${idAutor}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorAlvo(idAlvo: string): Observable<AvaliacaoModel[]> {
    return this.http.get<AvaliacaoModel[]>(
      `${this.API_URL}/alvo/${idAlvo}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorPedido(idPedido: string): Observable<AvaliacaoModel[]> {
    return this.http.get<AvaliacaoModel[]>(
      `${this.API_URL}/pedido/${idPedido}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }
}
