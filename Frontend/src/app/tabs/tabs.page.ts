import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTabs, IonIcon, IonLabel, IonTabButton, IonTabBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, searchOutline, receiptOutline, personOutline } from 'ionicons/icons';
import { NotificacaoService } from 'src/app/services/notificacao.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonTabs, IonIcon, IonLabel, IonTabButton, IonTabBar, CommonModule, FormsModule]
})
export class TabsPage implements OnInit, OnDestroy {

  constructor(private notificacaoService: NotificacaoService) {
    addIcons({ homeOutline, searchOutline, receiptOutline, personOutline });
  }

  ngOnInit() {
    // Enquanto o usuário estiver logado (dentro das tabs), fica de olho em
    // pedidos novos/concluídos pra disparar notificações no celular.
    this.notificacaoService.iniciar();
  }

  ngOnDestroy() {
    this.notificacaoService.parar();
  }

}
