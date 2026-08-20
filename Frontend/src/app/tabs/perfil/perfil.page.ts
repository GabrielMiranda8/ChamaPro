import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, mailOutline, calendarOutline, briefcaseOutline,
  notificationsOutline, settingsOutline, chevronForwardOutline,
  star, accessibilityOutline,
} from 'ionicons/icons';

import { UsuarioService } from 'src/app/services/usuario.service';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { TokenModel } from 'src/app/model/token.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonIcon],
})
export class PerfilPage implements OnInit {
  dados: UsuarioModel = new UsuarioModel();
  token!: TokenModel;

  constructor(
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
  ) {
    addIcons({
      personOutline,
      mailOutline,
      calendarOutline,
      briefcaseOutline,
      chevronForwardOutline,
      notificationsOutline,
      settingsOutline,
      star,
      accessibilityOutline,
    });
  }

  ngOnInit(): void {
    this.token = this.tokenService.extrair();
    this.usuarioService.buscarPorId(this.token.id).subscribe({
      next: (usuario) => {
        this.dados = usuario;
      },
      error: (err) => {
        console.log('Erro ao carregar dados de usuário:', err);
      },
    });
  }

  obterIniciais(nome: string): string {
    if (!nome) return '?';
    return nome
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0])
      .join('')
      .toUpperCase();
  }

  // ─── Atalhos ainda não implementados ────────────────────────────────────────

  editarPerfil(): void {
    console.log('Editar Perfil');
  }

  abrirNotificacoes(): void {
    console.log('Notificações');
  }

  abrirSeguranca(): void {
    console.log('Segurança');
  }
}
