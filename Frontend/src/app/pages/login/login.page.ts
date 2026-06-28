import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput, IonLabel, IonItem, IonIcon, IonHeader, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, logInOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { CaracteristicaModel } from 'src/app/model/caracteristica.model';
import { CaracteristicaService } from 'src/app/services/caracteristica.service';
import { TokenService } from 'src/app/services/token.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonLabel, IonItem, IonButton, IonInput, IonIcon,
    CommonModule, FormsModule, ReactiveFormsModule,
  ],
})
export class LoginPage implements OnInit {
  usuario: UsuarioModel;
  formGroup: FormGroup;
  loginValido: boolean

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private toastController: ToastController, private navController: NavController, private usuarioService: UsuarioService, private caracteristicaService: CaracteristicaService, private tokenService: TokenService) {
    addIcons({ mailOutline, lockClosedOutline, logInOutline, eyeOutline, eyeOffOutline });

    this.usuario = new UsuarioModel();
    this.loginValido = false;
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      senha: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.usuarioService.logout();
    let id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.usuarioService.buscarPorId(id).subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
        error: (err) => {
          console.log("Erro: ", err);
          this.exibirMensagem("Erro ao buscar usuário")
        }
      });
    }
    this.formGroup.get('email')?.setValue(this.usuario.email);
    this.formGroup.get('senha')?.setValue(this.usuario.senha);
    console.log(this.usuario.email);

    /*let carac1 = new CaracteristicaModel();
    carac1.nome = "Deficiência Auditiva"
    carac1.descricao = "Dificuldade para escutar"
    let carac2 = new CaracteristicaModel();
    carac2.nome = "Deficiência Cognitiva"
    carac2.descricao = "Dificuldade para compreender e relacionar com outros"
    this.caracteristicaService.salvar(carac1);
    this.caracteristicaService.salvar(carac2); */

  }

  autenticar() {
    if (!this.formGroup.valid) return;

    const email = this.formGroup.value.email;
    const senha = this.formGroup.value.senha;

    this.usuarioService.login(email, senha).subscribe({
      next: (token) => {
        this.tokenService.salvar(token);
        this.navController.navigateForward('/tabs/inicio');
      },
      error: (err) => {
        console.log("Erro no login: ", err);
        this.exibirMensagem("Email ou senha inválidos");
      }
    });
  }

  cadastro(): void {
    this.navController.navigateForward('/cadastro');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1500
    });
    toast.present()
  }
}
