import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { environment } from 'src/environments/environment';
import { MensagemModel } from '../model/mensagem.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly API_URL = `${environment.apiUrl}/mensagens`;

  private client: Client | null = null;
  private subscription: StompSubscription | null = null;
  private idPedidoConectado: string | null = null;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  // ─── Histórico (REST) ────────────────────────────────────────────────────

  listarHistorico(idPedido: string): Observable<MensagemModel[]> {
    return this.http.get<MensagemModel[]>(
      `${this.API_URL}/pedido/${idPedido}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  marcarComoLidas(idPedido: string): Observable<void> {
    return this.http.patch<void>(
      `${this.API_URL}/pedido/${idPedido}/marcar-lidas`,
      {},
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  // ─── Tempo real (STOMP sobre SockJS) ─────────────────────────────────────

  // Conecta no chat de um pedido específico. "aoReceber" é chamado toda vez
  // que uma mensagem (própria ou da outra parte) chega pelo tópico do pedido.
  conectar(idPedido: string, aoReceber: (mensagem: MensagemModel) => void, aoConectar?: () => void): void {
    this.desconectar();

    const token = this.tokenService.obterTokenBruto();
    this.idPedidoConectado = idPedido;

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws-chat`, null, {
        transports: ['websocket'] 
      }) as any,
      connectHeaders: {
        Authorization: `Bearer ${token}`  
      },
      reconnectDelay: 5000,
      onConnect: () => {
        if (!this.client) return;

        this.subscription = this.client.subscribe(`/topico/pedido/${idPedido}`, (frame: IMessage) => {
          try {
            const mensagem = JSON.parse(frame.body) as MensagemModel;
            aoReceber(mensagem);
          } catch (error) {
            console.log('Erro ao interpretar mensagem recebida no chat: ', error);
          }
        });

        if (aoConectar) {
          aoConectar();
        }
      },
      onStompError: (frame) => {
        console.log('Erro STOMP no chat: ', frame.headers['message'], frame.body);
      },
      onWebSocketError: (event) => {
        console.log('Erro de conexão com o chat: ', event);
      },
    });

    this.client.activate();
  }

  // Envia uma mensagem pro pedido atualmente conectado. A confirmação vem
  // de volta pelo próprio tópico assinado em "conectar" (echo do servidor).
  enviar(idPedido: string, texto: string): void {
    if (!this.client || !this.client.connected) {
      console.log('Tentativa de enviar mensagem sem conexão ativa com o chat.');
      return;
    }

    this.client.publish({
      destination: `/app/pedido/${idPedido}/enviar`,
      body: JSON.stringify({ idPedido, texto }),
    });
  }

  desconectar(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.idPedidoConectado = null;
  }
}
