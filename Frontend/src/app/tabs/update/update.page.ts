import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  eyeOutline,
  eyeOffOutline,
  lockClosedOutline,
  locationOutline,
  personOutline,
  checkmarkOutline,
} from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';

import { UsuarioService } from '../../services/usuario.service';
import { EnderecoService } from 'src/app/services/endereco.service';
import { EnderecoModel } from 'src/app/model/endereco.model';
import { TokenModel } from 'src/app/model/token.model';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonInput, IonButton, IonIcon, IonSpinner],
})
export class UpdatePage implements OnInit {
  token!: TokenModel;

  // Endereço existente (se o usuário já tiver um) e "foto" dos valores originais
  private enderecoAtual: EnderecoModel | null = null;
  private enderecoOriginal = '';

  // Senha
  novaSenha = '';
  confirmarNovaSenha = '';
  showSenha = signal(false);
  showConfirmarNovaSenha = signal(false);

  // Endereço
  cep = '';
  rua = '';
  numero = '';
  bairro = '';
  cidade = '';
  complemento = '';
  referencia = '';

  carregando = true;
  salvando = false;
  submitted = false;
  errors: Record<string, string> = {};

  constructor(
    private usuarioService: UsuarioService,
    private enderecoService: EnderecoService,
    private navController: NavController,
    private toastController: ToastController,
    private tokenService: TokenService,
  ) {
    addIcons({
      arrowBackOutline, eyeOutline, eyeOffOutline,
      lockClosedOutline, locationOutline, personOutline, checkmarkOutline,
    });
  }

  ngOnInit(): void {
    this.token = this.tokenService.extrair();

    if (!this.token?.id) {
      this.navController.navigateRoot('/login');
      return;
    }

    this.carregarEndereco();
  }

  // ─── Carregamento ──────────────────────────────────────────────────────────

  private carregarEndereco(): void {
    this.carregando = true;

    this.enderecoService.buscarPorUsuario(this.token.id).subscribe({
      next: (enderecos) => {
        if (enderecos.length > 0) {
          this.enderecoAtual = enderecos[0];
          this.cep = this.enderecoAtual.cep ?? '';
          this.rua = this.enderecoAtual.rua ?? '';
          this.numero = this.enderecoAtual.numero != null ? String(this.enderecoAtual.numero) : '';
          this.bairro = this.enderecoAtual.bairro ?? '';
          this.cidade = this.enderecoAtual.cidade ?? '';
          this.complemento = this.enderecoAtual.complemento ?? '';
          this.referencia = this.enderecoAtual.referencia ?? '';
        }
        this.enderecoOriginal = this.snapshotEndereco();
        this.carregando = false;
      },
      error: async (err) => {
        console.log('Erro ao carregar endereço:', err);
        this.carregando = false;
        await this.mostrarToast('Erro ao carregar seus dados.', 'danger');
      },
    });
  }

  private snapshotEndereco(): string {
    return JSON.stringify([
      this.cep, this.rua, this.numero, this.bairro,
      this.cidade, this.complemento, this.referencia,
    ]);
  }

  // ─── Helpers de tela ───────────────────────────────────────────────────────

  obterIniciais(nome: string): string {
    if (!nome) return '?';
    return nome.trim().split(' ').filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase();
  }

  toggleSenha(): void {
    this.showSenha.update((v) => !v);
  }

  toggleConfirmarNovaSenha(): void {
    this.showConfirmarNovaSenha.update((v) => !v);
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);

    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }

    this.cep = value;

    // Ao completar o CEP, preenche rua/bairro/cidade automaticamente (ViaCEP)
    if (value.replace(/\D/g, '').length === 8) {
      this.enderecoService.buscarPorCep(value).subscribe({
        next: (dados) => {
          if (dados.erro) {
            this.mostrarToast('CEP não encontrado.', 'warning');
            return;
          }
          this.rua = dados.logradouro || this.rua;
          this.bairro = dados.bairro || this.bairro;
          this.cidade = dados.localidade || this.cidade;
        },
        error: () => { /* se falhar, o usuário preenche na mão */ },
      });
    }
  }

  // ─── Validação ─────────────────────────────────────────────────────────────

  private validate(): boolean {
    this.errors = {};

    if (this.novaSenha || this.confirmarNovaSenha) {
      if (this.novaSenha.length < 3) {
        this.errors['novaSenha'] = 'Senha deve ter no mínimo 3 caracteres.';
      }
      if (this.confirmarNovaSenha !== this.novaSenha) {
        this.errors['confirmarNovaSenha'] = 'As senhas não coincidem.';
      }
    }

    if (!this.cep) {
      this.errors['cep'] = 'CEP é obrigatório.';
    } else if (this.cep.replace(/\D/g, '').length !== 8) {
      this.errors['cep'] = 'CEP inválido.';
    }
    if (!this.rua.trim()) this.errors['rua'] = 'Rua é obrigatória.';
    if (!this.numero.trim() || isNaN(Number(this.numero))) this.errors['numero'] = 'Número inválido.';
    if (!this.bairro.trim()) this.errors['bairro'] = 'Bairro é obrigatório.';
    if (!this.cidade.trim()) this.errors['cidade'] = 'Cidade é obrigatória.';

    return Object.keys(this.errors).length === 0;
  }

  // ─── Salvar ────────────────────────────────────────────────────────────────

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.salvando || !this.validate()) return;

    const senhaFoiAlterada = !!this.novaSenha;
    const enderecoFoiAlterado = this.snapshotEndereco() !== this.enderecoOriginal;

    if (!senhaFoiAlterada && !enderecoFoiAlterado) {
      await this.mostrarToast('Nenhuma alteração foi feita.', 'warning');
      return;
    }

    this.salvando = true;

    try {
      if (senhaFoiAlterada) {
        await firstValueFrom(this.usuarioService.alterarSenha(this.token.id, this.novaSenha));
      }

      if (enderecoFoiAlterado) {
        const endereco = new EnderecoModel();
        endereco.id = this.enderecoAtual?.id ?? '';
        endereco.idUsuario = this.token.id;
        endereco.cep = this.cep;
        endereco.rua = this.rua.trim();
        endereco.numero = Number(this.numero);
        endereco.bairro = this.bairro.trim();
        endereco.cidade = this.cidade.trim();
        endereco.complemento = this.complemento.trim();
        endereco.referencia = this.referencia.trim();

        // Já tinha endereço: atualiza. Não tinha: cria um novo.
        this.enderecoAtual = endereco.id
          ? await firstValueFrom(this.enderecoService.alterar(endereco))
          : await firstValueFrom(this.enderecoService.salvar(endereco));

        this.enderecoOriginal = this.snapshotEndereco();
      }

      this.novaSenha = '';
      this.confirmarNovaSenha = '';
      this.submitted = false;

      await this.mostrarToast('Dados atualizados com sucesso!', 'success');
      this.navController.navigateBack('/tabs/perfil');
    } catch (err: any) {
      console.log('Erro ao atualizar:', err);
      await this.mostrarToast('Erro ao atualizar dados. Verifique os campos.', 'danger');
    } finally {
      this.salvando = false;
    }
  }

  private async mostrarToast(message: string, color: 'success' | 'danger' | 'warning'): Promise<void> {
    const toast = await this.toastController.create({ message, duration: 2500, color, position: 'bottom' });
    await toast.present();
  }
}