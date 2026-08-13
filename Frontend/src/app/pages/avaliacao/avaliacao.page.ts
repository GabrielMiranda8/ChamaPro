import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonIcon, IonSpinner, ToastController,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline, starOutline, star, chatbubbleEllipsesOutline,
  checkmarkCircleOutline, timeOutline,
} from 'ionicons/icons';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PedidoModel } from 'src/app/model/pedido.model';
import { AvaliacaoModel } from 'src/app/model/avaliacao.model';
import { PedidoService } from 'src/app/services/pedido.service';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { TokenService } from 'src/app/services/token.service';

// Pedido finalizado, já casado com a informação de quem é o "outro lado"
// (quem vai ser avaliado) pra facilitar o template.
interface PedidoParaAvaliar extends PedidoModel {
  idAlvo: string;
  nomeAlvo: string;
}

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.page.html',
  styleUrls: ['./avaliacao.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonIcon, IonSpinner,
  ],
})
export class AvaliacaoPage implements OnInit {

  usuarioId = '';
  tipoUsuario = '';

  carregando = true;
  enviando: Record<string, boolean> = {};

  // Pedidos finalizados que o usuário logado ainda não avaliou
  pendentes: PedidoParaAvaliar[] = [];

  // Avaliações que o usuário logado já enviou
  enviadas: AvaliacaoModel[] = [];

  // Avaliações que o usuário logado recebeu (de clientes ou profissionais)
  recebidas: AvaliacaoModel[] = [];

  // Estado local do formulário de avaliação, indexado pelo id do pedido
  notaSelecionada: Record<string, number> = {};
  comentario: Record<string, string> = {};
  pedidoAberto: string | null = null;

  readonly estrelas = [1, 2, 3, 4, 5];

  constructor(
    private pedidoService: PedidoService,
    private avaliacaoService: AvaliacaoService,
    private tokenService: TokenService,
    private toastController: ToastController,
    private navController: NavController,
  ) {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'star-outline': starOutline,
      star,
      'chatbubble-ellipses-outline': chatbubbleEllipsesOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'time-outline': timeOutline,
    });
  }

  ngOnInit(): void {
    const token = this.tokenService.extrair();
    this.usuarioId = token.id;
    this.tipoUsuario = token.tipo;
    this.carregarDados();
  }

  // ─── Carregamento ───────────────────────────────────────────────────────────

  private carregarDados(): void {
    this.carregando = true;

    const buscaPedidos$ = this.tipoUsuario === 'PROFISSIONAL'
      ? this.pedidoService.buscarPorProfissional(this.usuarioId)
      : this.pedidoService.buscarPorCliente(this.usuarioId);

    forkJoin({
      pedidos: buscaPedidos$.pipe(catchError(() => of([] as PedidoModel[]))),
      enviadas: this.avaliacaoService.buscarPorAutor(this.usuarioId).pipe(catchError(() => of([] as AvaliacaoModel[]))),
      recebidas: this.avaliacaoService.buscarPorAlvo(this.usuarioId).pipe(catchError(() => of([] as AvaliacaoModel[]))),
    }).subscribe({
      next: ({ pedidos, enviadas, recebidas }) => {
        this.enviadas = enviadas;
        this.recebidas = recebidas;

        const idsPedidosJaAvaliados = new Set(enviadas.map(a => a.pedidoId));

        this.pendentes = pedidos
          .filter(p => p.status === 'FINALIZADO' && !idsPedidosJaAvaliados.has(p.id))
          .map(p => this.paraPedidoParaAvaliar(p));

        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.exibirMensagem('Não foi possível carregar suas avaliações. Tente novamente.');
      },
    });
  }

  private paraPedidoParaAvaliar(p: PedidoModel): PedidoParaAvaliar {
    const ehProfissional = this.tipoUsuario === 'PROFISSIONAL';
    return {
      ...p,
      idAlvo: ehProfissional ? p.idCliente : p.idProfissional,
      nomeAlvo: ehProfissional ? p.nomeCliente : p.nomeProfissional,
    };
  }

  // ─── Formulário de avaliação ────────────────────────────────────────────────

  abrirFormulario(pedido: PedidoParaAvaliar): void {
    this.pedidoAberto = this.pedidoAberto === pedido.id ? null : pedido.id;
    if (!this.notaSelecionada[pedido.id]) {
      this.notaSelecionada[pedido.id] = 0;
    }
  }

  selecionarNota(idPedido: string, nota: number): void {
    this.notaSelecionada[idPedido] = nota;
  }

  enviarAvaliacao(pedido: PedidoParaAvaliar): void {
    const nota = this.notaSelecionada[pedido.id];

    if (!nota || nota < 1) {
      this.exibirMensagem('Selecione de 1 a 5 estrelas antes de enviar.');
      return;
    }

    const avaliacao = new AvaliacaoModel();
    avaliacao.autorId = this.usuarioId;
    avaliacao.alvoId = pedido.idAlvo;
    avaliacao.pedidoId = pedido.id;
    avaliacao.nota = nota;
    avaliacao.descricao = (this.comentario[pedido.id] || '').trim();

    this.enviando[pedido.id] = true;

    this.avaliacaoService.salvar(avaliacao).subscribe({
      next: (salva) => {
        delete this.enviando[pedido.id];
        this.pendentes = this.pendentes.filter(p => p.id !== pedido.id);
        this.enviadas = [salva, ...this.enviadas];
        this.pedidoAberto = null;
        this.exibirMensagem(`Avaliação enviada para ${pedido.nomeAlvo}!`);
      },
      error: (err) => {
        delete this.enviando[pedido.id];
        console.log('Erro ao enviar avaliação: ', err);
        this.exibirMensagem('Erro ao enviar avaliação. Tente novamente.');
      },
    });
  }

  // ─── Utils de exibição ───────────────────────────────────────────────────────

  obterEstrelas(nota: number): boolean[] {
    return this.estrelas.map(n => n <= Math.round(nota));
  }

  mediaRecebida(): number {
    if (this.recebidas.length === 0) return 0;
    const soma = this.recebidas.reduce((acc, a) => acc + a.nota, 0);
    return Math.round((soma / this.recebidas.length) * 10) / 10;
  }

  voltar(): void {
    this.navController.navigateRoot('/tabs/pedidos');
  }

  private async exibirMensagem(texto: string): Promise<void> {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2200,
      position: 'top',
    });
    await toast.present();
  }
}
