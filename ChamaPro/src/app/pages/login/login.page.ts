import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput, IonLabel, IonItem, IonIcon, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonButton, IonInput, IonIcon, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  email: string = '';
  senha: string = '';
  formGroup: FormGroup;


  constructor(private formBuilder: FormBuilder, private toastController: ToastController, private navController: NavController) {
    addIcons({ eyeOutline, eyeOffOutline });

    this.formGroup = this.formBuilder.group({
      'email': [this.email, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      'senha': [this.senha, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() { }

  autenticar() {
    
    // Implementar lógica de autenticação
  }

  cadastro(){
    this.navController.navigateBack('/cadastro');
  }
}
