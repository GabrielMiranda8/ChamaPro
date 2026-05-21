import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonIcon, AlertController, ToastController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personOutline,
  createOutline,
  trashOutline,
  chevronForwardOutline,
  logOutOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon],
})
export class MenuPage {
  constructor(
    private navController: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({
      personOutline,
      createOutline,
      trashOutline,
      chevronForwardOutline,
      logOutOutline,
    });
  }

  irParaMeusDados(): void {
    this.navController.navigateForward('/view');
  }

  irParaAlterar(): void {
    this.navController.navigateForward('/update');
  }

  async confirmarDelete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Deletar Conta',
      message: 'Tem certeza que deseja deletar sua conta? Esta ação é irreversível.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Deletar',
          role: 'destructive',
          cssClass: 'alert-btn-danger',
          handler: () => {
            this.deletarConta();
          },
        },
      ],
    });
    await alert.present();
  }

  private async deletarConta(): Promise<void> {
    // TODO: chamar AuthService.delete() aqui
    console.log('Conta deletada');

    const toast = await this.toastController.create({
      message: 'Conta deletada com sucesso.',
      duration: 2500,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();

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
            // TODO: AuthService.logout() aqui
            this.navController.navigateRoot('/login');
          },
        },
      ],
    });
    await alert.present();
  }
}