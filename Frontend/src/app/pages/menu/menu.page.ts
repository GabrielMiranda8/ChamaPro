import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonIcon, AlertController, ToastController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personOutline, createOutline, trashOutline,
  chevronForwardOutline, logOutOutline,
} from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioModel } from '../../model/usuario.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon],
})
export class MenuPage implements OnInit {

  usuarioLogado: UsuarioModel | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private navController: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({ personOutline, createOutline, trashOutline, chevronForwardOutline, logOutOutline });
  }

  ngOnInit(): void {
    this.usuarioLogado = this.usuarioService.getLogin();
    if (!this.usuarioLogado) {
      this.navController.navigateRoot('/login');
    }
  }

  irParaMeusDados(): void { this.navController.navigateForward('/view'); }
  irParaAlterar(): void   { this.navController.navigateForward('/tabs/update'); }

  async confirmarDelete(): Promise<void> {
    const alert = await this.alertController.create({
      header: ' Deletar Conta',
      message: 'Esta ação é irrevrersível. Todos os seus dados serão apagados permanentemente.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sim, deletar',
          role: 'destructive',
          cssClass: 'alert-btn-danger',
          handler: () => this.deletarConta(),
        },
      ],
    });
    await alert.present();
  }

  private async deletarConta(): Promise<void> {
    const logado = this.usuarioService.getLogin();
    if (!logado) return;

    const sucesso = this.usuarioService.excluir(logado.id);

    const toast = await this.toastController.create({
      message: sucesso ? 'Conta deletada com sucesso.' : 'Erro ao deletar conta.',
      duration: 2500,
      color: sucesso ? 'danger' : 'warning',
      position: 'bottom',
    });
    await toast.present();

    // excluir() já limpa o localStorage 'login' se era o logado
    this.navController.navigateRoot('/login');
  }

  async sair(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sair',
      message: 'Deseja sair da sua conta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair',
          handler: () => {
            this.usuarioService.excluirLogin();
            this.navController.navigateRoot('/login');
          },
        },
      ],
    });
    await alert.present();
  }
}