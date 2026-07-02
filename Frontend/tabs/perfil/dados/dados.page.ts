import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonButton, IonIcon, NavController, } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, calendarOutline, cardOutline, locationOutline, briefcaseOutline, arrowBackOutline, createOutline, } from 'ionicons/icons';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { AlertController, ToastController } from '@ionic/angular';
import { TokenModel } from 'src/app/model/token.model';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.page.html',
  styleUrls: ['./dados.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonButton, IonIcon]
})
export class DadosPage implements OnInit {
  dados: UsuarioModel;
  token!: TokenModel;

  constructor(private usuarioService: UsuarioService, private toastController: ToastController, private navController: NavController, private alertController: AlertController, private tokenService: TokenService) {
    addIcons({
      personOutline,
      mailOutline,
      calendarOutline,
      cardOutline,
      locationOutline,
      briefcaseOutline,
      arrowBackOutline,
      createOutline,
    });
    this.dados = new UsuarioModel();
  }

  ngOnInit(): void {
    this.token = this.tokenService.extrair();
    this.usuarioService.buscarPorId(this.token.id).subscribe({
      next: (usuario) => {
        this.dados = usuario;
      }
    })
  }

}
