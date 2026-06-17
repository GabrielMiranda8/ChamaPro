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
      nome: 'Ana Silva',
      iniciais: 'AS',
      especialidade: 'Eletricista Residencial',
      nota: 4.9,
      avaliacoes: 127,
      valor: 80,
      verificado: true,
      libras: true
    },
    {
      nome: 'Carlos Santos',
      iniciais: 'CS',
      especialidade: 'Eletricista Industrial',
      nota: 4.8,
      avaliacoes: 93,
      valor: 70,
      verificado: true,
      libras: false
    },
    {
      nome: 'Maria Oliveira',
      iniciais: 'MO',
      especialidade: 'Eletricista de Segurança',
      nota: 4.7,
      avaliacoes: 68,
      valor: 60,
      verificado: false,
      libras: true
    }
  ];
  constructor(private router: Router) {
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
