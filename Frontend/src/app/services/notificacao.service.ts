import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

import { PedidoModel } from '../model/pedido.model';
import { PedidoService } from './pedido.service';
import { TokenService } from './token.service';

// Intervalo do polling. O app já usa esse mesmo modelo (HTTP polling, sem
// infraestrutura de push) na feature de chat, então mantemos o padrão aqui.
const INTERVALO_MS = 25000;

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {

  private intervalId: any = null;
  private statusConhecidos = new Map<string, string>();
  private primeiraCarga = true;
  private proximoIdNotificacao = 1;

  constructor(
    private pedidoService: PedidoService,
    private tokenService: TokenService,
  ) { }

  // Chamado uma vez, ao entrar na área logada do app (ex: TabsPage).
  async iniciar(): Promise<void> {
    if (this.intervalId) {
      return; // já está rodando
    }

    if (Capacitor.isNativePlatform()) {
      try {
        const permissao = await LocalNotifications.checkPermissions();
        if (permissao.display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }
      } catch (error) {
        console.log('Erro ao solicitar permissão de notificações: ', error);
      }
    }

    await this.verificarPedidos();
    this.intervalId = setInterval(() => this.verificarPedidos(), INTERVALO_MS);
  }

  parar(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.statusConhecidos.clear();
    this.primeiraCarga = true;
  }

  // ─── Polling ─────────────────────────────────────────────────────────────

  private async verificarPedidos(): Promise<void> {
    const token = this.tokenService.extrair();
    if (!token?.id) {
      return;
    }

    const busca$ = token.tipo === 'PROFISSIONAL'
      ? this.pedidoService.buscarPorProfissional(token.id)
      : this.pedidoService.buscarPorCliente(token.id);

    busca$.subscribe({
      next: (pedidos) => this.compararEDispararNotificacoes(pedidos, token.tipo),
      error: (err) => console.log('Erro ao verificar novos pedidos: ', err),
    });
  }

  private compararEDispararNotificacoes(pedidos: PedidoModel[], tipoUsuario: string): void {
    // Na primeira carga só guardamos o estado atual - não faz sentido notificar
    // sobre pedidos que já existiam antes de abrir o app.
    if (this.primeiraCarga) {
      pedidos.forEach(p => this.statusConhecidos.set(p.id, p.status));
      this.primeiraCarga = false;
      return;
    }

    for (const pedido of pedidos) {
      const statusAnterior = this.statusConhecidos.get(pedido.id);

      if (statusAnterior === undefined && pedido.status === 'PENDENTE' && tipoUsuario === 'PROFISSIONAL') {
        // Pedido novo, ainda nem existia na última verificação
        this.notificar(
          'Novo pedido recebido!',
          `${pedido.nomeCliente} solicitou ${pedido.nomeServico}.`,
        );
      } else if (statusAnterior && statusAnterior !== pedido.status && pedido.status === 'FINALIZADO') {
        // Serviço concluído - vale lembrar de avaliar
        const outraParte = tipoUsuario === 'PROFISSIONAL' ? pedido.nomeCliente : pedido.nomeProfissional;
        this.notificar(
          'Serviço concluído!',
          `Seu pedido com ${outraParte} foi finalizado. Que tal avaliar?`,
        );
      }

      this.statusConhecidos.set(pedido.id, pedido.status);
    }
  }

  private async notificar(titulo: string, corpo: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      // Em navegador (ng serve) não há notificações nativas - só loga, pra
      // não quebrar o fluxo durante o desenvolvimento.
      console.log(`[Notificação] ${titulo} - ${corpo}`);
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: this.proximoIdNotificacao++,
            title: titulo,
            body: corpo,
            schedule: { at: new Date(Date.now() + 500) },
          },
        ],
      });
    } catch (error) {
      console.log('Erro ao disparar notificação local: ', error);
    }
  }
}
