import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput, IonLabel, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { TokenService } from 'src/app/services/token.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonLabel, IonButton, IonInput, IonIcon,
    CommonModule, FormsModule, ReactiveFormsModule,
  ],
})
export class LoginPage implements OnInit {
  formGroup: FormGroup;
  showSenha = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private navController: NavController,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private loadingController: LoadingController,
  ) {
    addIcons({ eyeOutline, eyeOffOutline });

    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.usuarioService.logout();
  }

  toggleSenha() {
    this.showSenha = !this.showSenha;
  }

  async autenticar() {
    const loading = await this.loadingController.create({
      message: 'Aguarde...',
      spinner: 'crescent'
    });

    await loading.present();

    if (!this.formGroup.valid) {
      this.exibirMensagem('Preencha e-mail e senha.');
      return;
    }

    const { email, senha } = this.formGroup.value;

    this.usuarioService.login(email, senha).subscribe({
      next: async (token: string) => {
        await loading.dismiss();
        this.tokenService.salvar(token);
        this.navController.navigateRoot('/tabs/inicio');
      },
      error: async (err) => {
        await loading.dismiss();
        this.exibirMensagem('Email ou senha inválidos.');
        console.log("Erro no login", err);
          this.exibirMensagem('Erro: ' + JSON.stringify({
            status: err.status,
            message: err.message,
            url: err.url
          }));
          console.log("Erro no login", err);
        }
    });

  }

  cadastro() {
    this.navController.navigateForward('/cadastro');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
