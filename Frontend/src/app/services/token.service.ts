import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { TokenModel } from '../model/token.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly AUTORIZACAO_USUARIO = 'Authorization';

  salvar(token: string): void {
    localStorage.setItem(this.AUTORIZACAO_USUARIO, JSON.stringify(token));
  }

  excluir(): void {
    localStorage.removeItem(this.AUTORIZACAO_USUARIO);
  }

  gerarCabecalhoAutenticacao(): HttpHeaders {
    const authorization = JSON.parse(localStorage.getItem(this.AUTORIZACAO_USUARIO) || '""');
    const headers = new HttpHeaders({ Authorization: authorization.token });
    return headers
  }

  extrair(): TokenModel {
    const authorization = JSON.parse(localStorage.getItem(this.AUTORIZACAO_USUARIO) || '""');
    const tokenModel = new TokenModel();
    try {
      const tokenBase64 = authorization.token.split('.')[1];
      const tokenvJson = atob(tokenBase64);
      const token = JSON.parse(tokenvJson);
      tokenModel.id = token.sub;
      tokenModel.nome = token.nome;
      tokenModel.email = token.email;
      tokenModel.tipo = token.role;
    } catch (error) {
      console.error('Erro ao extrair token JWT', error);
    }
    return tokenModel;
  }
}


