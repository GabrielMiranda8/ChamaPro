import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonIcon,
  AlertController,
  ToastController,
  ModalController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  timeOutline,
  checkmarkCircleOutline,
  constructOutline,
  closeCircleOutline,
  banOutline,
  arrowUpOutline,
  arrowDownOutline
} from 'ionicons/icons';

import { PedidoModel } from 'src/app/model/pedido.model';
import { PedidoService } from 'src/app/services/pedido.service';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { AddHorarioComponent } from 'src/app/components/add-horario/add-horario.component';

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
  dadosUsuario: UsuarioModel;

  tipoUsuario = '';
  campoOrdenacao = 'data';
  direcaoOrdenacao = 'desc'; // 'asc' ou 'desc'
  constructor(
    private pedidoService: PedidoService,
    private tokenService: TokenService,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
  ) {
    addIcons({
      'time-outline': timeOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'construct-outline': constructOutline,
      'close-circle-outline': closeCircleOutline,
      'ban-outline': banOutline,
      'arrow-up-outline': arrowUpOutline,
      'arrow-down-outline': arrowDownOutline
    });
    this.dadosUsuario = new UsuarioModel();
  }

  ngOnInit(): void {
    this.dadosUsuario = this.tokenService.extrair() as UsuarioModel;
    this.tipoUsuario = this.dadosUsuario.tipo;
    this.carregarPedidos();
  }

  // ─── Carregamento ───────────────────────────────────────────────────────────

  private carregarPedidos(): void {
    this.carregando = true;

    this.pedidoService.buscarPorUsuario(this.dadosUsuario.id).subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.ordenarPedidos();
        this.carregando = false;
      },
      error: (err) => {
        console.log('Erro ao buscar pedidos do usuario: ', err);
        this.carregando = false;
        this.mostrarToast('Erro ao carregar pedidos.', 'danger');
      }
    });
    console.log('Pedidos carregados: ', this.pedidos);
  }

  // Chamado pelo <select> do filtro sempre que o usuário troca o campo ou a direção
  alterarOrdenacao(campo: string): void {
    if (this.campoOrdenacao === campo) {
      // Clicou de novo no mesmo campo -> inverte a direção
      if (this.direcaoOrdenacao === 'asc') {
        this.direcaoOrdenacao = 'desc';
      } else {
        this.direcaoOrdenacao = 'asc';
      }
    } else {
      // Trocou de campo -> começa em decrescente por padrão
      this.campoOrdenacao = campo;
      this.direcaoOrdenacao = 'desc';
    }
    this.ordenarPedidos();
  }

  private ordenarPedidos(): void {
    const listaOrdenada: PedidoModel[] = [];

    // Copia os pedidos pra uma lista nova, sem mexer na original ainda
    for (let i = 0; i < this.pedidos.length; i++) {
      listaOrdenada.push(this.pedidos[i]);
    }

    // Bubble sort na lista nova
    for (let i = 0; i < listaOrdenada.length; i++) {
      for (let j = 0; j < listaOrdenada.length - 1 - i; j++) {
        const atual = listaOrdenada[j];
        const proximo = listaOrdenada[j + 1];

        const deveTrocar = this.deveTrocarPosicao(atual, proximo);

        if (deveTrocar) {
          listaOrdenada[j] = proximo;
          listaOrdenada[j + 1] = atual;
        }
      }
    }

    // Só agora troca a referência que o template usa
    this.pedidos = listaOrdenada;
  }

  trackByPedidoId(index: number, pedido: PedidoModel): string {
    return pedido.id;
  }

  // Decide se "proximo" deveria vir antes de "atual", de acordo com o campo
  // e a direção escolhidos. Retorna true = troca as posições.
  private deveTrocarPosicao(atual: PedidoModel, proximo: PedidoModel): boolean {
    let valorAtual: number;
    let valorProximo: number;

    if (this.campoOrdenacao === 'data') {
      valorAtual = new Date(atual.data).getTime();
      valorProximo = new Date(proximo.data).getTime();
    } else if (this.campoOrdenacao === 'preco') {
      valorAtual = atual.preco;
      valorProximo = proximo.preco;
    } else if (this.campoOrdenacao === 'status') {
      valorAtual = this.obterPesoStatus(atual.status);
      valorProximo = this.obterPesoStatus(proximo.status);
    } else if (this.campoOrdenacao === 'urgencia') {
      valorAtual = this.obterPesoUrgencia(atual.status);
      valorProximo = this.obterPesoUrgencia(proximo.status);
    } else {
      valorAtual = 0;
      valorProximo = 0;
    }

    if (this.direcaoOrdenacao === 'asc') {
      return valorAtual > valorProximo;
    } else {
      return valorAtual < valorProximo;
    }
  }

  // Define uma ordem "alfabética de negócio" pro status, já que STATUS é
  // texto e não tem ordem natural. Ajuste os números como fizer sentido.
  private obterPesoStatus(status: string): number {
    if (status === 'PENDENTE') return 1;
    if (status === 'ACEITO') return 2;
    if (status === 'EM_ANDAMENTO') return 3;
    if (status === 'FINALIZADO') return 4;
    if (status === 'RECUSADO') return 5;
    if (status === 'CANCELADO') return 6;
    return 0;
  }

  // Assumindo urgência = quão "pendente de ação" o pedido está.
  // Se você tiver um campo real de urgência, troca essa função pra ler ele direto.
  private obterPesoUrgencia(status: string): number {
    if (status === 'PENDENTE') return 4;
    if (status === 'ACEITO') return 3;
    if (status === 'EM_ANDAMENTO') return 2;
    if (status === 'FINALIZADO') return 1;
    if (status === 'RECUSADO') return 0;
    if (status === 'CANCELADO') return 0;
    return 0;
  }

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
    if (pedido.status === 'EM_ANDAMENTO') return false;
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

  async aceitarPedido(pedido: PedidoModel): Promise<void> {
    const modal = await this.modalController.create({
      component: AddHorarioComponent,
      componentProps: { pedido },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data && data.sucesso) {
      this.substituirPedidoNaLista(data.pedido);
      this.mostrarToast('Pedido aceito!', 'success');
    }
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