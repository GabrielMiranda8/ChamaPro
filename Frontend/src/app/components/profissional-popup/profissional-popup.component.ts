import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonContent,
  IonButton,
  IonIcon,
  ModalController,
  ToastController,
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
  totalServicos = 0;         // Futuramente virá do backend
  disponibilidade = 'Seg a Sex, 8h – 18h'; // Futuramente virá do perfil

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
  ) {
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
  }

  // ─── Fecha o popup sem ação ────────────────────────────────────────────────

  fechar() {
    this.modalCtrl.dismiss();
  }

  // ─── Chat ──────────────────────────────────────────────────────────────────

  // O Chat ainda não foi implementado no backend (entidade Chat é só um
  // placeholder vazio por enquanto). Por isso o botão fica visível mas não
  // navega pra lugar nenhum - só avisa que a função está a caminho.
  async abrirChat(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Chat em breve! Essa funcionalidade ainda está em desenvolvimento.',
      duration: 2000,
      color: 'medium',
      position: 'top',
    });
    await toast.present();
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

  calcularIdade(dtNasc: Date | string | undefined): number {
    if (!dtNasc) return 0;
    // dtNasc chega do backend como string JSON, mesmo tipado como Date no model —
    // new Date(...) aqui converte nos dois casos (string ou Date já existente).
    const nascimento = new Date(dtNasc);
    if (isNaN(nascimento.getTime())) return 0; // data inválida/malformada
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
    if (!this.profissional?.caracteristicas) {
      return false;
    }
    for (const c of this.profissional.caracteristicas) {
      if (c.nome.toUpperCase() === nome.toUpperCase()) {
        return true;
      }
    }
    return false;
  }

}