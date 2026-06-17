import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonContent,
  IonButton,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  handLeftOutline,
  checkmarkCircleOutline,
  calendarOutline,
  timeOutline,
  starOutline,
  star,
  briefcaseOutline,
  chatbubbleOutline,
} from 'ionicons/icons';

import { UsuarioModel } from 'src/app/model/usuario.model';
import { ServicoModel } from 'src/app/model/servico.model';
import { ProfissionalServicoModel } from 'src/app/model/profissional-servico.model';

import { ContratoComponent } from 'src/app/components/contrato/contrato.component';
@Component({
  selector: 'app-profissional-popup',
  templateUrl: './profissional-popup.component.html',
  styleUrls: ['./profissional-popup.component.scss'],
  imports: [CommonModule, IonHeader, IonContent, IonButton, IonIcon],
})
export class ProfissionalPopupComponent implements OnInit {

  @Input() profissional!: UsuarioModel;
  @Input() profissionalServico!: ProfissionalServicoModel;
  @Input() servico!: ServicoModel;
  @Input() cliente!: UsuarioModel;

  // Valores calculados/fixos exibidos no popup
  totalServicos = 312;         // Futuramente virá do backend
  disponibilidade = 'Seg a Sex, 8h – 18h'; // Futuramente virá do perfil

  constructor(private modalCtrl: ModalController) {
    addIcons({
      closeOutline,
      handLeftOutline,
      checkmarkCircleOutline,
      calendarOutline,
      timeOutline,
      starOutline,
      star,
      briefcaseOutline,
      chatbubbleOutline,
    });
  }

  ngOnInit(): void { }

  // ─── Abre o modal de Contratar em cima deste popup ─────────────────────────

  async abrirContratar(): Promise<void> {
    // Cria um segundo modal por cima do popup atual
    const modal = await this.modalCtrl.create({
      component: ContratoComponent,
      componentProps: {
        profissional: this.profissional,
        profissionalServico: this.profissionalServico,
        cliente: this.cliente,
      },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handle: false,
    });

    await modal.present();

    // Quando o modal de Contratar fechar, verifica o resultado
    const { data } = await modal.onWillDismiss();

    if (data?.sucesso) {
      // Fecha o popup também, devolvendo o sucesso para a busca
      this.modalCtrl.dismiss({ sucesso: true, pedido: data.pedido });
    }

    if (data?.abrirChat) {
      this.modalCtrl.dismiss({ abrirChat: true });
    }
  }

  // ─── Fecha o popup sem ação ────────────────────────────────────────────────

  fechar() {
    this.modalCtrl.dismiss();
  }

  // ─── Chat ──────────────────────────────────────────────────────────────────

  abrirChat() {
    this.modalCtrl.dismiss({ abrirChat: true });
  }

  // ─── Ver perfil completo ───────────────────────────────────────────────────

  verPerfilCompleto() {
    // Fecha o popup e sinaliza para navegar ao perfil
    this.modalCtrl.dismiss({ verPerfil: true, idProfissional: this.profissional.id });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  obterIniciais(nome: string = ''): string {
    return nome.split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase();
  }

  calcularIdade(dtNasc: string = ''): number {
    if (!dtNasc) return 0;
    const nascimento = new Date(dtNasc);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesPassou = hoje.getMonth() > nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() >= nascimento.getDate());
    if (!mesPassou) idade--;
    return idade;
  }

  calcularAnos(data: Date | undefined): number {
    if (!data) return 0;
    const inicio = new Date(data);
    return new Date().getFullYear() - inicio.getFullYear();
  }

  possuiCaracteristica(nome: string): boolean {
    return this.profissional?.caracteristicas?.some(
      c => c.nome.toUpperCase() === nome.toUpperCase()
    ) ?? false;
  }

}
