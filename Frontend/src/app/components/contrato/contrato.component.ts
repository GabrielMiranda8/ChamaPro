import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonIcon,
  IonSpinner,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cashOutline,
  locationOutline,
  calendarOutline,
  alertCircleOutline,
  closeOutline,
  chatbubbleEllipsesOutline,
} from 'ionicons/icons';

import { PedidoModel } from 'src/app/model/pedido.model';
import { EnderecoModel } from 'src/app/model/endereco.model';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { ServicoModel } from 'src/app/model/servico.model';
import { ServicoService } from 'src/app/services/servico.service';
import { ProfissionalServicoModel } from 'src/app/model/profissional-servico.model';

// Substitua pelos seus serviços reais
// import { PedidoService } from 'src/app/services/pedido.service';
// import { ViaCepService } from 'src/app/services/via-cep.service';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class ContratoComponent implements OnInit {
  /** Profissional sendo contratado (passado via modalController.create props) */
  @Input() profissional!: UsuarioModel;

  /** Dados do serviço do profissional (preço, tipo etc.) */
  @Input() profissionalServico!: ProfissionalServicoModel;

  /** Cliente logado */
  @Input() cliente!: UsuarioModel;

  pedidoForm!: FormGroup;
  carregando = false;

  /** Endereço do cliente para exibição */
  enderecoCliente: EnderecoModel | null = null;

  /** Data mínima = hoje */
  dataMinima: string = new Date().toISOString().split('T')[0];

  /** Horários disponíveis para seleção */
  horasDisponiveis: string[] = this.gerarHoras();

  servico!: ServicoModel;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private servicoService: ServicoService,
    // private pedidoService: PedidoService,
    // private viaCepService: ViaCepService,
  ) {
    addIcons({
      cashOutline,
      locationOutline,
      calendarOutline,
      alertCircleOutline,
      closeOutline,
      chatbubbleEllipsesOutline,
    });
  }

  ngOnInit(): void {
    this.enderecoCliente = this.cliente?.endereco ?? null;
    this.inicializarForm();
     this.servicoService.buscarPorId(this.profissionalServico.idServico).subscribe({
      next: (servico) =>{
        this.servico = servico;
      },
      error: (err) =>{
        console.log("Erro ao buscar servico: ", err);
      }
     });
  }

  // ─── Formulário ────────────────────────────────────────────────────────────

  private inicializarForm(): void {
    this.pedidoForm = this.formBuilder.group({
      usarEnderecoCliente: [true],
      outroEndereco: this.formBuilder.group({
        cep: [''],
        rua: [''],
        numero: [''],
        complemento: [''],
        bairro: [''],
        cidade: [''],
        referencia: [''],
      }),
      data: ['', Validators.required],
      hora: ['', Validators.required],
      urgencia: ['baixa', Validators.required],
      descricao: [''],
    });

    // Atualiza validações ao trocar tipo de endereço
    this.pedidoForm.get('usarEnderecoCliente')!.valueChanges.subscribe(
      (usar) => this.atualizarValidacaoEndereco(usar)
    );
  }

  private atualizarValidacaoEndereco(usarCadastrado: boolean): void {
    const group = this.pedidoForm.get('outroEndereco') as FormGroup;
    const campos = ['cep', 'rua', 'numero', 'bairro', 'cidade'];

    if (usarCadastrado) {
      campos.forEach((c) => group.get(c)?.clearValidators());
    } else {
      group.get('cep')?.setValidators([Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]);
      group.get('rua')?.setValidators(Validators.required);
      group.get('numero')?.setValidators(Validators.required);
      group.get('bairro')?.setValidators(Validators.required);
      group.get('cidade')?.setValidators(Validators.required);
    }

    campos.forEach((c) => group.get(c)?.updateValueAndValidity());
  }

  // ─── Seleções ──────────────────────────────────────────────────────────────

  selecionarEndereco(usarCadastrado: boolean): void {
    this.pedidoForm.get('usarEnderecoCliente')?.setValue(usarCadastrado);
  }

  selecionarUrgencia(nivel: 'baixa' | 'media' | 'alta'): void {
    this.pedidoForm.get('urgencia')?.setValue(nivel);
  }

  // ─── Máscaras ──────────────────────────────────────────────────────────────

  mascaraCep(event: CustomEvent): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '').slice(0, 8);

    if (valor.length > 5) {
      valor = valor.slice(0, 5) + '-' + valor.slice(5);
    }

    this.pedidoForm.get('outroEndereco.cep')?.setValue(valor, { emitEvent: false });
  }

  // ─── ViaCEP ────────────────────────────────────────────────────────────────

  buscarCep(): void {
    const cep = this.pedidoForm.get('outroEndereco.cep')?.value?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (data.erro) return;
        const g = this.pedidoForm.get('outroEndereco') as FormGroup;
        g.patchValue({
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
        });
      })
      .catch(() => {/* silently ignore */ });
  }

  // ─── Validação helpers ─────────────────────────────────────────────────────

  isInvalid(campo: string): boolean {
    const ctrl = this.pedidoForm.get(campo);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  isInvalidNested(grupo: string, campo: string): boolean {
    const ctrl = this.pedidoForm.get(`${grupo}.${campo}`);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  private marcarTudoComoTocado(group: FormGroup): void {
    Object.values(group.controls).forEach((ctrl) => {
      ctrl.markAsTouched();
      if ((ctrl as FormGroup).controls) {
        this.marcarTudoComoTocado(ctrl as FormGroup);
      }
    });
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  async enviarPedido(): Promise<void> {
    this.marcarTudoComoTocado(this.pedidoForm);

    if (this.pedidoForm.invalid) {
      this.mostrarToast('Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const val = this.pedidoForm.value;

    const pedido = new PedidoModel();
    pedido.idProfissional = this.profissional.id;
    pedido.idCliente = this.cliente.id;
    pedido.idServico = this.profissionalServico.idServico;
    pedido.preco = this.profissionalServico.preco;
    pedido.status = 'pendente';

    // Combina data + hora
    const dataHora = new Date(`${val.data}T${val.hora}:00`);
    pedido.data = dataHora;

    // Endereço
    if (val.usarEnderecoCliente && this.enderecoCliente) {
      pedido.endereco = this.enderecoCliente;
    } else {
      const e = new EnderecoModel();
      Object.assign(e, val.outroEndereco);
      pedido.endereco = e;
    }

    this.carregando = true;
    try {
      // Descomente e substitua pela chamada real ao seu serviço:
      // await this.pedidoService.criar(pedido);

      // Simulação de delay de rede
      await new Promise((r) => setTimeout(r, 1200));

      await this.mostrarToast('Pedido enviado com sucesso!', 'success');
      this.modalController.dismiss({ pedido, sucesso: true });
    } catch (err) {
      this.mostrarToast('Erro ao enviar pedido. Tente novamente.', 'danger');
    } finally {
      this.carregando = false;
    }
  }

  // ─── Ações secundárias ─────────────────────────────────────────────────────

  fechar(): void {
    this.modalController.dismiss({ sucesso: false });
  }

  // ─── Utils ─────────────────────────────────────────────────────────────────

  private extrairValorNumerico(valor: string): number {
    return parseFloat(valor.replace(/[^\d]/g, '')) || 0;
  }

  private gerarHoras(): string[] {
    const horas: string[] = [];
    for (let h = 6; h <= 22; h++) {
      horas.push(`${h.toString().padStart(2, '0')}:00`);
      horas.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return horas;
  }

  private async mostrarToast(
    message: string,
    color: 'success' | 'warning' | 'danger'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'top',
      cssClass: 'custom-toast',
    });
    await toast.present();
  }
}
