import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonIcon,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, logInOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';

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
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private navController: NavController,
  ) {
    addIcons({mailOutline,lockClosedOutline,logInOutline,eyeOutline,eyeOffOutline});

    this.formGroup = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  ngOnInit(): void {}

  async autenticar(): Promise<void> {
    if (!this.formGroup.valid) return;

    const { email, senha } = this.formGroup.value;

    // TODO: chamar AuthService.login({ email, senha }) aqui
    console.log('Login payload:', { email, senha });

    this.navController.navigateRoot('/menu');
  }

  cadastro(): void {
    this.navController.navigateForward('/cadastro');
  }
}
