import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PedidoModel } from '../model/pedido.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly API_URL = `${environment.apiUrl}/pedido`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  salvar(pedido: PedidoModel): Observable<PedidoModel> {
    return this.http.post<PedidoModel>(
      this.API_URL,
      pedido,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  listar(): Observable<PedidoModel[]> {
    return this.http.get<PedidoModel[]>(
      this.API_URL,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorId(id: string): Observable<PedidoModel> {
    return this.http.get<PedidoModel>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  alterar(pedido: PedidoModel): Observable<PedidoModel> {
    return this.http.put<PedidoModel>(
      `${this.API_URL}/${pedido.id}`,
      pedido,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorCliente(idCliente: string): Observable<PedidoModel[]> {
    return this.http.get<PedidoModel[]>(
      `${this.API_URL}/cliente/${idCliente}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorProfissional(idProfissional: string): Observable<PedidoModel[]> {
    return this.http.get<PedidoModel[]>(
      `${this.API_URL}/profissional/${idProfissional}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  atualizarStatus(id: string): Observable<PedidoModel> {
    return this.http.patch<PedidoModel>(
      `${this.API_URL}/${id}/status`,
      {},
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }
  recusar(id: string): Observable<PedidoModel> {
    return this.http.patch<PedidoModel>(
      `${this.API_URL}/${id}/recusar`,
      {},
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  cancelar(id: string): Observable<PedidoModel> {
    return this.http.patch<PedidoModel>(
      `${this.API_URL}/${id}/cancelar`,
      {},
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }
}