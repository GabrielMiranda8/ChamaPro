import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTabs, IonIcon, IonLabel, IonTabButton, IonTabBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, searchOutline, receiptOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonTabs, IonIcon, IonLabel, IonTabButton, IonTabBar, CommonModule, FormsModule]
})
export class TabsPage implements OnInit {

  constructor() {
    addIcons({ homeOutline, searchOutline, receiptOutline, personOutline });
  }

  ngOnInit() {
  }

}
