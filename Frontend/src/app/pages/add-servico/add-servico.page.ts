import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButton, IonIcon, IonInput, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline, addOutline, arrowForwardOutline,
  handLeftOutline, eyeOutline, earOutline, accessibilityOutline,
  bodyOutline, micOutline, chatbubbleOutline,
} from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ServicoModel } from 'src/app/model/servico.model';
import { ServicoService } from 'src/app/services/servico.service';
import { CaracteristicaModel } from 'src/app/model/caracteristica.model';
import { CaracteristicaService } from 'src/app/services/caracteristica.service';
import { ProfissionalServicoModel } from 'src/app/model/profissional-servico.model';
import { ProfissionalServicoService } from 'src/app/services/profissional-servico.service';

@Component({
  selector: 'app-add-servico',
  templateUrl: './add-servico.page.html',
  styleUrls: ['./add-servico.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonButton, IonIcon, IonInput,
  ],
})
export class AddServicoPage implements OnInit {

  usuarioId!: string;
  todosServicos: ServicoModel[] = [];
  todasCaracteristicas: CaracteristicaModel[] = [];

  servicosSelecionados: ServicoModel[] = [];
  caracsSelecionadas: CaracteristicaModel[] = [];
  outraEspecialidade = '';

  constructor(
    private servicoService: ServicoService,
    private caracteristicaService: CaracteristicaService,
    private profissionalServicoService: ProfissionalServicoService,
    private toastController: ToastController,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
  ) {
    addIcons({
      briefcaseOutline, addOutline, arrowForwardOutline,
      handLeftOutline, eyeOutline, earOutline, accessibilityOutline,
      bodyOutline, micOutline, chatbubbleOutline,
    });
  }

  ngOnInit() {
    this.usuarioId = this.activatedRoute.snapshot.params['id'];
    this.todosServicos = this.servicoService.listar();
    this.todasCaracteristicas = this.caracteristicaService.listar();
  }

  // ── Seleção de serviços ──────────────────────────────────

  isServicoSelecionado(servico: ServicoModel): boolean {
    return this.servicosSelecionados.some(s => s.id === servico.id);
  }

  toggleServico(servico: ServicoModel) {
    if (this.isServicoSelecionado(servico)) {
      this.servicosSelecionados = this.servicosSelecionados.filter(s => s.id !== servico.id);
    } else {
      this.servicosSelecionados.push(servico);
    }
  }

  adicionarOutra() {
    const nome = this.outraEspecialidade.trim();
    if (!nome) return;
    const novoServico = new ServicoModel();
    novoServico.nome = nome;
    this.servicosSelecionados.push(novoServico);
    this.outraEspecialidade = '';
  }

  // ── Seleção de características ───────────────────────────

  isCaracSelecionada(carac: CaracteristicaModel): boolean {
    return this.caracsSelecionadas.some(c => c.id === carac.id);
  }

  toggleCarac(carac: CaracteristicaModel) {
    if (this.isCaracSelecionada(carac)) {
      this.caracsSelecionadas = this.caracsSelecionadas.filter(c => c.id !== carac.id);
    } else {
      this.caracsSelecionadas.push(carac);
    }
  }

  iconePorCaracteristica(nome: string): string {
    const mapa: Record<string, string> = {
      'libras': 'hand-left-outline',
      'visual': 'eye-outline',
      'auditiva': 'ear-outline',
      'cognitiva': 'accessibility-outline',
      'motora': 'body-outline',
      'audiodescrição': 'mic-outline',
      'leitura labial': 'chatbubble-outline',
    };
    const chave = Object.keys(mapa).find(k => nome.toLowerCase().includes(k));
    return chave ? mapa[chave] : 'accessibility-outline';
  }

  // ── Salvar ───────────────────────────────────────────────

  async salvar() {
    if (this.servicosSelecionados.length === 0) {
      await this.exibirMensagem('Selecione ao menos um serviço.');
      return;
    }

    this.servicosSelecionados.forEach(s => {
      const ps = new ProfissionalServicoModel();
      ps.idServico = s.id;
      ps.idProfissional = this.usuarioId;
      this.profissionalServicoService.salvar(ps);
    });

    this.navController.navigateRoot('/login');
  }

  pular() {
    this.navController.navigateRoot('/login');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
