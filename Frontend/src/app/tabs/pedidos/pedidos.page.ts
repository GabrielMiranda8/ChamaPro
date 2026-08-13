import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonIcon,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  timeOutline,
  checkmarkCircleOutline,
  constructOutline,
  closeCircleOutline,
  banOutline,
} from 'ionicons/icons';

import { PedidoModel } from 'src/app/model/pedido.model';
import { PedidoService } from 'src/app/services/pedido.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon
  ]
})
export class PedidosPage implements OnInit {

  pedidos: PedidoModel[] = [];
  carregando = false;

  // guarda o tipo do usuário logado ('CLIENTE' ou 'PROFISSIONAL') pra decidir
  // qual busca fazer e quais botões mostrar no template
  tipoUsuario = '';

  constructor(
    private pedidoService: PedidoService,
    private tokenService: TokenService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({
      'time-outline': timeOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'construct-outline': constructOutline,
      'close-circle-outline': closeCircleOutline,
      'ban-outline': banOutline,
    });
  }

  ngOnInit(): void {
    this.carregarPedidos();
  }

  // ─── Carregamento ───────────────────────────────────────────────────────────

  private carregarPedidos(): void {
    const usuario = this.tokenService.extrair();
    this.tipoUsuario = usuario.tipo;
    this.carregando = true;

    if (usuario.tipo === 'PROFISSIONAL') {
      this.pedidoService.buscarPorProfissional(usuario.id).subscribe({
        next: (pedidos) => {
          this.pedidos = pedidos;
          this.carregando = false;
        },
        error: (err) => {
          console.log('Erro ao buscar pedidos do profissional: ', err);
          this.carregando = false;
          this.mostrarToast('Erro ao carregar pedidos.', 'danger');
        }
      });
      return;
    }

    // se não é profissional, trata como cliente
    this.pedidoService.buscarPorCliente(usuario.id).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.carregando = false;
      },
      error: (err) => {
        console.log('Erro ao buscar pedidos do cliente: ', err);
        this.carregando = false;
        this.mostrarToast('Erro ao carregar pedidos.', 'danger');
      }
    });
  }

  // ─── Exibição de status ─────────────────────────────────────────────────────
  // Isolei essa tradução status -> classe/ícone/texto em funções porque, com 6
  // valores de status agora (PENDENTE, ACEITO, EM_ANDAMENTO, FINALIZADO,
  // RECUSADO, CANCELADO), um ternário encadeado no template ficaria ilegível.
  // Cada função abaixo tem uma responsabilidade só e usa if/else simples.

  obterClasseStatus(status: string): string {
    if (status === 'PENDENTE') return 'pendente';
    if (status === 'ACEITO') return 'aceito';
    if (status === 'EM_ANDAMENTO') return 'andamento';
    if (status === 'FINALIZADO') return 'concluido';
    if (status === 'RECUSADO') return 'recusado';
    if (status === 'CANCELADO') return 'cancelado';
    return '';
  }

  obterIconeStatus(status: string): string {
    if (status === 'PENDENTE') return 'time-outline';
    if (status === 'ACEITO') return 'checkmark-circle-outline';
    if (status === 'EM_ANDAMENTO') return 'construct-outline';
    if (status === 'FINALIZADO') return 'checkmark-circle-outline';
    if (status === 'RECUSADO') return 'close-circle-outline';
    if (status === 'CANCELADO') return 'ban-outline';
    return 'time-outline';
  }

  obterLabelStatus(status: string): string {
    if (status === 'PENDENTE') return 'Pendente';
    if (status === 'ACEITO') return 'Aceito';
    if (status === 'EM_ANDAMENTO') return 'Em andamento';
    if (status === 'FINALIZADO') return 'Concluído';
    if (status === 'RECUSADO') return 'Recusado';
    if (status === 'CANCELADO') return 'Cancelado';
    return status;
  }

  // Diz pro template se ainda faz sentido mostrar botões de ação nesse pedido
  pedidoEstaAtivo(pedido: PedidoModel): boolean {
    if (pedido.status === 'FINALIZADO') return false;
    if (pedido.status === 'RECUSADO') return false;
    if (pedido.status === 'CANCELADO') return false;
    return true;
  }

  // ─── Ações do CLIENTE ───────────────────────────────────────────────────────

  async cancelarPedido(pedido: PedidoModel): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Cancelar pedido',
      message: 'Tem certeza que deseja cancelar esse pedido?',
      buttons: [
        { text: 'Voltar', role: 'cancel' },
        {
          text: 'Cancelar pedido',
          role: 'destructive',
          handler: () => this.confirmarCancelamento(pedido)
        }
      ]
    });
    await alert.present();
  }

  private confirmarCancelamento(pedido: PedidoModel): void {
    this.pedidoService.cancelar(pedido.id).subscribe({
      next: (pedidoAtualizado) => {
        this.substituirPedidoNaLista(pedidoAtualizado);
        this.mostrarToast('Pedido cancelado.', 'success');
      },
      error: (err) => {
        console.log('Erro ao cancelar pedido: ', err);
        this.mostrarToast('Erro ao cancelar o pedido.', 'danger');
      }
    });
  }

  // ─── Ações do PROFISSIONAL ──────────────────────────────────────────────────

  aceitarPedido(pedido: PedidoModel): void {
    this.pedidoService.atualizarStatus(pedido.id).subscribe({
      next: (pedidoAtualizado) => {
        this.substituirPedidoNaLista(pedidoAtualizado);
        this.mostrarToast('Pedido aceito!', 'success');
      },
      error: (err) => {
        console.log('Erro ao aceitar pedido: ', err);
        this.mostrarToast('Erro ao aceitar o pedido.', 'danger');
      }
    });
  }

  recusarPedido(pedido: PedidoModel): void {
    this.pedidoService.recusar(pedido.id).subscribe({
      next: (pedidoAtualizado) => {
        this.substituirPedidoNaLista(pedidoAtualizado);
        this.mostrarToast('Pedido recusado.', 'success');
      },
      error: (err) => {
        console.log('Erro ao recusar pedido: ', err);
        this.mostrarToast('Erro ao recusar o pedido.', 'danger');
      }
    });
  }

  // Usado tanto pra "Iniciar serviço" (ACEITO -> EM_ANDAMENTO) quanto
  // "Finalizar serviço" (EM_ANDAMENTO -> FINALIZADO) - o backend decide
  // sozinho pra qual status avança, então é a mesma chamada nos dois casos.
  avancarPedido(pedido: PedidoModel): void {
    this.pedidoService.atualizarStatus(pedido.id).subscribe({
      next: (pedidoAtualizado) => {
        this.substituirPedidoNaLista(pedidoAtualizado);
        this.mostrarToast('Status do pedido atualizado.', 'success');
      },
      error: (err) => {
        console.log('Erro ao atualizar status do pedido: ', err);
        this.mostrarToast('Erro ao atualizar o pedido.', 'danger');
      }
    });
  }

  obterTextoBotaoAvancar(status: string): string {
    if (status === 'ACEITO') return 'Iniciar serviço';
    if (status === 'EM_ANDAMENTO') return 'Finalizar serviço';
    return '';
  }

  // ─── Utils ───────────────────────────────────────────────────────────────────

  // Troca, na lista local, o pedido antigo pelo que voltou atualizado da API -
  // evita ter que recarregar a lista inteira de novo a cada ação.
  private substituirPedidoNaLista(pedidoAtualizado: PedidoModel): void {
    for (let i = 0; i < this.pedidos.length; i++) {
      if (this.pedidos[i].id === pedidoAtualizado.id) {
        this.pedidos[i] = pedidoAtualizado;
        return;
      }
    }
  }

  private async mostrarToast(mensagem: string, cor: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: cor,
      position: 'top',
    });
    await toast.present();
  }

}