import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { TokenModel } from '../model/token.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly AUTORIZACAO_USUARIO = 'Authorization';

  salvar(resposta: any): void {
    const token = typeof resposta === 'string' ? resposta : resposta?.token;
    if (token) {
      localStorage.setItem(this.AUTORIZACAO_USUARIO, JSON.stringify({ token }));
    }
  }

  excluir(): void {
    localStorage.removeItem(this.AUTORIZACAO_USUARIO);
  }

  gerarCabecalhoAutenticacao(): HttpHeaders {
    const salvo = JSON.parse(localStorage.getItem(this.AUTORIZACAO_USUARIO) || '{}');
    const token = salvo?.token || '';
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  extrair(): TokenModel {
    const salvo = JSON.parse(localStorage.getItem(this.AUTORIZACAO_USUARIO) || '{}');
    const tokenModel = new TokenModel();

    try {
      const tokenBase64 = salvo.token.split('.')[1];
      const tokenvJson = atob(tokenBase64);
      const token = JSON.parse(tokenvJson);
      tokenModel.id = token.id;
      tokenModel.nome = token.nome;
      tokenModel.email = token.sub;
      tokenModel.tipo = token.tipo;
    } catch (error) {
      console.error('Erro ao extrair token JWT', error);
    }

    return tokenModel;
  }
}
