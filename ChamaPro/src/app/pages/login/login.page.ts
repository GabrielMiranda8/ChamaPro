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

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private toastController: ToastController, private navController: NavController, private usuarioService: UsuarioService, private caracteristicaService: CaracteristicaService) {
    addIcons({ mailOutline, lockClosedOutline, logInOutline, eyeOutline, eyeOffOutline });

    this.usuario = new UsuarioModel();
    this.loginValido = false;
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      senha: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.usuarioService.excluirLogin();
    let id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.usuario = this.usuarioService.buscarPorId(id);
    }
    this.formGroup.get('email')?.setValue(this.usuario.email);
    this.formGroup.get('senha')?.setValue(this.usuario.senha);
    console.log(this.usuario.email);
  
    let carac1 = new CaracteristicaModel();
    carac1.nome = "Deficiência Auditiva"
    carac1.descricao = "Dificuldade para escutar"
    let carac2 = new CaracteristicaModel();
    carac2.nome = "Deficiência Cognitiva"
    carac2.descricao = "Dificuldade para compreender e relacionar com outros"
    this.caracteristicaService.salvar(carac1);
    this.caracteristicaService.salvar(carac2);
    
  }

  autenticar() {
    if (!this.formGroup.valid) return;

    this.usuario.email = this.formGroup.value.email;
    this.usuario.senha = this.formGroup.value.senha;
    console.log(this.usuario)

    this.loginValido = this.usuarioService.autenticar(this.usuario.email, this.usuario.senha);
    if (this.loginValido){
      this.usuarioService.logar(this.usuario);
      this.navController.navigateForward('/menu')
    } else {
      this.exibirMensagem("Login inválido");
    }
  }

  cadastro(): void {
    this.navController.navigateForward('/cadastro');
  }

  async exibirMensagem(texto: string){
    const toast = await this.toastController.create({
      message: texto,
      duration: 1500
    });
    toast.present()
  }
}
