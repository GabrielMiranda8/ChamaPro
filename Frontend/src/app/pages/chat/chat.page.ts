import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
  IonContent, IonIcon, IonSpinner, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, sendOutline, chatbubbleEllipsesOutline } from 'ionicons/icons';

import { MensagemModel } from 'src/app/model/mensagem.model';
import { PedidoModel } from 'src/app/model/pedido.model';
import { ChatService } from 'src/app/services/chat.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonIcon, IonSpinner,
  ],
})
export class ChatPage implements OnInit, OnDestroy {

  @ViewChild('scrollArea') scrollArea?: ElementRef<HTMLDivElement>;

  idPedido = '';
  usuarioId = '';

  nomeOutraParte = '';
  nomeServico = '';

  mensagens: MensagemModel[] = [];
  texto = '';

  carregando = true;
  conectando = true;
  enviando = false;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private chatService: ChatService,
    private pedidoService: PedidoService,
    private tokenService: TokenService,
    private toastController: ToastController,
  ) {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'send-outline': sendOutline,
      'chatbubble-ellipses-outline': chatbubbleEllipsesOutline,
    });
  }

  ngOnInit(): void {
    const token = this.tokenService.extrair();
    this.usuarioId = token.id;

    this.idPedido = this.route.snapshot.paramMap.get('pedidoId') || '';
    this.nomeOutraParte = this.route.snapshot.queryParamMap.get('nome') || '';
    console.log('Nome da outra parte vindo do query param: ', this.nomeOutraParte);
    this.nomeServico = this.route.snapshot.queryParamMap.get('servico') || '';

    if (!this.idPedido) {
      this.voltar();
      return;
    }

    if (!this.nomeOutraParte) {
      this.carregarDadosPedido(token.tipo);
    }

    this.carregarHistorico();
    this.conectarChat();
  }

  ngOnDestroy(): void {
    this.chatService.desconectar();
  }

  // ─── Carregamento ───────────────────────────────────────────────────────────

  // Só é chamado quando o usuário chega direto no link do chat, sem passar
  // pela tela de Pedidos (que já manda nome/serviço via query params).
  private carregarDadosPedido(tipoUsuario: string): void {
    this.pedidoService.buscarPorId(this.idPedido).subscribe({
      next: (pedido: PedidoModel) => {
        this.nomeOutraParte = tipoUsuario === 'PROFISSIONAL' ? pedido.nomeCliente : pedido.nomeProfissional;
        console.log('Nome da outra parte carregado do pedido: ', this.nomeOutraParte);  
        console.log("Tipo Usuario: ", tipoUsuario);
        console.log("Cliente: ", pedido.nomeCliente);
        console.log("Profissional: ", pedido.nomeProfissional);
        this.nomeServico = pedido.nomeServico;
      },
      error: (err) => console.log('Erro ao carregar dados do pedido para o chat: ', err),
    });
  }

  private carregarHistorico(): void {
    this.carregando = true;

    this.chatService.listarHistorico(this.idPedido).subscribe({
      next: (mensagens) => {
        this.mensagens = mensagens;
        this.carregando = false;
        this.rolarParaFinal();
        this.chatService.marcarComoLidas(this.idPedido).subscribe({
          error: (err) => console.log('Erro ao marcar mensagens como lidas: ', err),
        });
      },
      error: (err) => {
        console.log('Erro ao carregar histórico do chat: ', err);
        this.carregando = false;
        this.exibirMensagem('Não foi possível carregar as mensagens.');
      },
    });
  }

  private conectarChat(): void {
    this.conectando = true;

    this.chatService.conectar(
      this.idPedido,
      (mensagem) => this.receberMensagem(mensagem),
      () => { this.conectando = false; },
    );
  }

  private receberMensagem(mensagem: MensagemModel): void {
    // Evita duplicar caso a mensagem já tenha vindo pelo histórico inicial
    if (this.mensagens.some(m => m.id === mensagem.id)) {
      return;
    }

    this.mensagens = [...this.mensagens, mensagem];
    this.rolarParaFinal();

    if (mensagem.idRemetente !== this.usuarioId) {
      this.chatService.marcarComoLidas(this.idPedido).subscribe({
        error: (err) => console.log('Erro ao marcar mensagens como lidas: ', err),
      });
    }
  }

  // ─── Envio ───────────────────────────────────────────────────────────────────

  enviarMensagem(): void {
    const texto = this.texto.trim();
    if (!texto) return;

    this.enviando = true;
    this.chatService.enviar(this.idPedido, texto);
    this.texto = '';

    // O item some da caixa de texto na hora; a bolha só aparece quando o
    // servidor devolver a mensagem pelo tópico (garante consistência).
    setTimeout(() => { this.enviando = false; }, 400);
  }

  aoPressionarTecla(evento: KeyboardEvent): void {
    if (evento.key === 'Enter' && !evento.shiftKey) {
      evento.preventDefault();
      this.enviarMensagem();
    }
  }

  // ─── Utils ───────────────────────────────────────────────────────────────────

  ehMinhaMensagem(mensagem: MensagemModel): boolean {
    return mensagem.idRemetente === this.usuarioId;
  }

  private rolarParaFinal(): void {
    setTimeout(() => {
      if (this.scrollArea?.nativeElement) {
        const el = this.scrollArea.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 60);
  }

  voltar(): void {
    this.navController.navigateRoot('/tabs/pedidos');
  }

  private async exibirMensagem(texto: string): Promise<void> {
    const toast = await this.toastController.create({
      message: texto,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }
}
