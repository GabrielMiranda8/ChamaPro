import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, closeOutline, timeOutline } from 'ionicons/icons';

import { PedidoModel } from 'src/app/model/pedido.model';
import { CompromissoModel } from 'src/app/model/compromisso.model';
import { PedidoService } from 'src/app/services/pedido.service';
import { CompromissoService } from 'src/app/services/compromisso.service';

@Component({
  selector: 'app-add-horario',
  templateUrl: './add-horario.component.html',
  styleUrls: ['./add-horario.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class AddHorarioComponent implements OnInit {
  /** Pedido que está sendo aceito */
  @Input() pedido!: PedidoModel;

  form!: FormGroup;
  horasDisponiveis: string[] = [];
  horariosOcupados: CompromissoModel[] = [];
  dataMinima = new Date().toISOString().split('T')[0];
  carregando = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private pedidoService: PedidoService,
    private compromissoService: CompromissoService,
  ) {
    addIcons({ calendarOutline, closeOutline, timeOutline });
  }

  ngOnInit(): void {
    this.horasDisponiveis = this.gerarHoras();
    this.inicializarForm();
    this.buscarHorariosOcupados();
  }

  // ─── Formulário ────────────────────────────────────────────────────────────

  private inicializarForm(): void {
    // Pré-preenche com o que o cliente sugeriu ao criar o pedido, se houver
    const dataInicial = this.pedido.dataSugerida || '';
    const horaInicialSugerida = this.pedido.horaSugerida || '';

    this.form = this.formBuilder.group({
      data: [dataInicial, Validators.required],
      horaInicio: [horaInicialSugerida, Validators.required],
      horaFim: ['', Validators.required],
    });

    this.form.get('data')!.valueChanges.subscribe(() => this.buscarHorariosOcupados());
  }

  private gerarHoras(): string[] {
    const horas: string[] = [];
    for (let h = 0; h <= 23; h++) {
      horas.push(`${h.toString().padStart(2, '0')}:00`);
      horas.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return horas;
  }

  // ─── Disponibilidade ─────────────────────────────────────────────────────────

  private buscarHorariosOcupados(): void {
    const data = this.form.get('data')!.value;
    if (!data) {
      return;
    }

    this.compromissoService.buscarPorProfissionalEData(this.pedido.idProfissional, data).subscribe({
      next: (lista) => {
        this.horariosOcupados = lista;
      },
      error: (err) => {
        console.log('Erro ao buscar horários ocupados: ', err);
        this.horariosOcupados = [];
      }
    });
  }

  // Usado no template pra desabilitar visualmente as opções ocupadas
  horarioEstaOcupado(hora: string): boolean {
    for (let i = 0; i < this.horariosOcupados.length; i++) {
      const ocupado = this.horariosOcupados[i];
      if (hora >= ocupado.horaInicio && hora < ocupado.horaFim) {
        return true;
      }
    }
    return false;
  }

  isInvalid(campo: string): boolean {
    const ctrl = this.form.get(campo);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  // ─── Confirmação ───────────────────────────────────────────────────────────

  confirmar(): void {
    this.form.get('data')!.markAsTouched();
    this.form.get('horaInicio')!.markAsTouched();
    this.form.get('horaFim')!.markAsTouched();

    if (this.form.invalid) {
      this.mostrarToast('Preencha data, horário de início e de término.', 'warning');
      return;
    }

    const data = this.form.get('data')!.value;
    const horaInicio = this.form.get('horaInicio')!.value;
    const horaFim = this.form.get('horaFim')!.value;

    if (horaFim <= horaInicio) {
      this.mostrarToast('O horário de término deve ser depois do início.', 'warning');
      return;
    }

    if (this.horarioEstaOcupado(horaInicio)) {
      this.mostrarToast('Você já tem um compromisso nesse horário.', 'warning');
      return;
    }

    this.carregando = true;

    this.pedidoService.aceitar(this.pedido.id, data, horaInicio, horaFim).subscribe({
      next: async (pedidoAtualizado) => {
        this.carregando = false;
        await this.mostrarToast('Pedido aceito e agenda atualizada!', 'success');
        this.modalController.dismiss({ pedido: pedidoAtualizado, sucesso: true });
      },
      error: (err) => {
        console.log('Erro ao aceitar pedido: ', err);
        this.carregando = false;
        const mensagem = err?.error?.message || 'Erro ao aceitar o pedido.';
        this.mostrarToast(mensagem, 'danger');
      }
    });
  }

  fechar(): void {
    this.modalController.dismiss({ sucesso: false });
  }

  private async mostrarToast(message: string, color: 'success' | 'warning' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'top',
    });
    await toast.present();
  }
}