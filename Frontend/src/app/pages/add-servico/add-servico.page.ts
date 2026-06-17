import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonText, IonIcon, IonButton, ToastController } from '@ionic/angular/standalone';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NavController } from '@ionic/angular';
import { ServicoModel } from 'src/app/model/servico.model';
import { ServicoService } from 'src/app/services/servico.service';
import { ActivatedRoute } from '@angular/router';
import { ProfissionalServicoModel } from 'src/app/model/profissional-servico.model';
import { ProfissionalServicoService } from 'src/app/services/profissional-servico.service';
@Component({
  selector: 'app-add-servico',
  templateUrl: './add-servico.page.html',
  styleUrls: ['./add-servico.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonText, IonIcon, IonButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddServicoPage implements OnInit {
  profissionalServico: ProfissionalServicoModel;
  usuarioId!: string;
  todosServicos: ServicoModel[] = [];
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService, private servicoService: ServicoService, private toastController: ToastController, private navController: NavController, private activatedRoute: ActivatedRoute, private profissionalServicoService: ProfissionalServicoService) {
    this.formGroup = this.formBuilder.group({
      servicos: [[]]
    });
    this.profissionalServico = new ProfissionalServicoModel();
  }

  ngOnInit() {
    this.usuarioId = this.activatedRoute.snapshot.params['id'];
    this.todosServicos = this.servicoService.listar();
  }

  async salvar() {
    const servicos: ServicoModel[] = this.formGroup.value.servicos;
    servicos.forEach(s => { 
      let ps = new ProfissionalServicoModel();

      ps.idServico = s.id;
      ps.idProfissional = this.usuarioId;
      this.profissionalServicoService.salvar(ps);
      
    });

    // tem que fazer a funcao de adicionar servico no profissional
    // await this.usuarioService.adicionarServicos(this.usuarioId, servicos);

    this.navController.navigateRoot('/login');
  }

}
