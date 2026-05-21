import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonNote, IonToggle, ToastController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  // CORRIGIDO: era 'app-cadastro'
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonNote,
    IonToggle,
  ],
})
export class UpdatePage {
  // Form fields
  novaSenha = '';
  confirmarNovaSenha = '';
  cep = '';
  isProfissional = false;

  // UI state
  submitted = false;
  errors: Record<string, string> = {};

  // Password visibility
  showSenha = signal(false);
  showConfirmarNovaSenha = signal(false);

  constructor(
    private navController: NavController,
    private toastController: ToastController,
  ) {
    addIcons({ arrowBackOutline, eyeOutline, eyeOffOutline });
  }

  toggleSenha(): void {
    this.showSenha.update((v) => !v);
  }

  toggleConfirmarNovaSenha(): void {
    this.showConfirmarNovaSenha.update((v) => !v);
  }

  // ── Mask ─────────────────────────────────────────────────────────────────

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    this.cep = value;
  }

  // ── Validation ───────────────────────────────────────────────────────────

  private validate(): boolean {
    this.errors = {};

    if (!this.novaSenha) {
      this.errors['novaSenha'] = 'Nova senha é obrigatória.';
    } else if (this.novaSenha.length < 6) {
      this.errors['novaSenha'] = 'Senha deve ter no mínimo 6 caracteres.';
    }

    if (!this.confirmarNovaSenha) {
      this.errors['confirmarNovaSenha'] = 'Confirmação de senha é obrigatória.';
    // CORRIGIDO: comparava com this.novaSenha mas estava undefined no original
    } else if (this.confirmarNovaSenha !== this.novaSenha) {
      this.errors['confirmarNovaSenha'] = 'As senhas não coincidem.';
    }

    if (!this.cep) {
      this.errors['cep'] = 'CEP é obrigatório.';
    } else if (this.cep.length < 9) {
      this.errors['cep'] = 'CEP inválido.';
    }

    return Object.keys(this.errors).length === 0;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (!this.validate()) {
      return;
    }

    const payload = {
      novaSenha: this.novaSenha,
      cep: this.cep,
      isProfissional: this.isProfissional,
    };

    console.log('Update payload:', payload);
    // TODO: chamar AuthService.update(payload) aqui

    const toast = await this.toastController.create({
      message: 'Dados atualizados com sucesso!',
      duration: 2000,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();

    this.navController.navigateBack('/menu');
  }
}