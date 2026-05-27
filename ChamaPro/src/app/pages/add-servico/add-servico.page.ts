import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonText, ToastController } from '@ionic/angular/standalone';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NavController } from '@ionic/angular';
import { ServicoModel } from 'src/app/model/servico.model';
import { ServicoService } from 'src/app/services/servico.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-servico',
  templateUrl: './add-servico.page.html',
  styleUrls: ['./add-servico.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonText, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddServicoPage implements OnInit {
  usuarioId!: string;
  todosServicos: ServicoModel[] = [];
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService, private servicoService: ServicoService, private toastController: ToastController, private navController: NavController, private activatedRoute: ActivatedRoute) {
    this.formGroup = this.formBuilder.group({
      servicos: [[]]
    });
  }

  ngOnInit() {
    this.usuarioId = this.activatedRoute.snapshot.params['id'];
    this.todosServicos = this.servicoService.listar();
  }

  async salvar() {
    const servicos = this.formGroup.value.servicos;

    // tem que fazer a funcao de adicionar servico no profissional
    // await this.usuarioService.adicionarServicos(this.usuarioId, servicos);

    this.navController.navigateRoot('/login');
  }

}
