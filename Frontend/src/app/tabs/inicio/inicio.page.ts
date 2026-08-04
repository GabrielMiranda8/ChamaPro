import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  locationOutline,
  bulbOutline,
  businessOutline,
  sunnyOutline,
  handLeftOutline,
  star
} from 'ionicons/icons';
import { TokenModel } from 'src/app/model/token.model';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, CommonModule, FormsModule]
})
export class InicioPage implements OnInit {
  profissionais = [
    {
      nome: 'Carlo Ancelotti',
      iniciais: 'CA',
      especialidade: 'Eletricista Residencial',
      nota: 4.9,
      avaliacoes: 127,
      valor: 80,
      verificado: true,
      libras: true
    },
    {
      nome: 'Douglas Santos',
      iniciais: 'CS',
      especialidade: 'Eletricista Industrial',
      nota: 4.8,
      avaliacoes: 93,
      valor: 70,
      verificado: true,
      libras: false
    },
    {
      nome: 'Gabriel Magalhães',
      iniciais: 'MO',
      especialidade: 'Eletricista de Segurança',
      nota: 4.7,
      avaliacoes: 68,
      valor: 60,
      verificado: false,
      libras: true
    }
  ];

  dados: UsuarioModel = new UsuarioModel();
  token!: TokenModel;

  constructor(private router: Router, private tokenService: TokenService, private usuarioService: UsuarioService) {
    addIcons({
      searchOutline,
      locationOutline,
      bulbOutline,
      businessOutline,
      sunnyOutline,
      handLeftOutline,
      star
    });
  }

  ngOnInit() {
    this.token = this.tokenService.extrair();
    this.usuarioService.buscarPorId(this.token.id).subscribe({
      next: (usuario) => {
        this.dados = usuario;
      },
      error: (err) => {
        console.log("Erro ao carregar dados de usuário: ", err);
      }
    })
  }

  abrirProfissional(profissional: any) {
    console.log(profissional);
    // futuramente:
    // this.router.navigate(['/view', profissional.id]);
  }

  filtrarCategoria(categoria: string) {
    console.log('Categoria:', categoria);
  }

  buscarProfissionaisLibras() {
    this.router.navigate(['/tabs/busca']);
  }

}