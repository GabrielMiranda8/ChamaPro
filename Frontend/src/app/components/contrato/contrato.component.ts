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
import { PedidoService } from 'src/app/services/pedido.service';
import { EnderecoService } from 'src/app/services/endereco.service';

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
    private pedidoService: PedidoService,
    private enderecoService: EnderecoService,
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
      next: (servico) => {
        this.servico = servico;
      },
      error: (err) => {
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
      for (const campo of campos) {
        group.get(campo)?.clearValidators();
      }
    } else {
      group.get('cep')?.setValidators([Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]);
      group.get('rua')?.setValidators(Validators.required);
      group.get('numero')?.setValidators(Validators.required);
      group.get('bairro')?.setValidators(Validators.required);
      group.get('cidade')?.setValidators(Validators.required);
    }

    for (const campo of campos) {
      group.get(campo)?.updateValueAndValidity();
    }
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
    for (const nomeCampo in group.controls) {
      const ctrl = group.controls[nomeCampo];
      ctrl.markAsTouched();
      // se o controle for um FormGroup aninhado (ex: outroEndereco), desce nele também
      if ((ctrl as FormGroup).controls) {
        this.marcarTudoComoTocado(ctrl as FormGroup);
      }
    }
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  // Ponto de entrada do envio. Fica curto de propósito: só decide QUAL caminho
  // seguir (endereço já cadastrado x endereço novo) e delega pros métodos abaixo.
  // Assim cada função tem uma responsabilidade só e fica fácil de debugar.
  async enviarPedido(): Promise<void> {
    this.marcarTudoComoTocado(this.pedidoForm);

    if (this.pedidoForm.invalid) {
      this.mostrarToast('Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const val = this.pedidoForm.value;
    const dataHora = new Date(`${val.data}T${val.hora}:00`);

    this.carregando = true;

    if (val.usarEnderecoCliente === true) {
      // Caso 1: usar o endereço que já está cadastrado no perfil do cliente.
      // Esse endereço já existe no banco, então já tem um id - não precisa salvar de novo.
      if (!this.enderecoCliente || !this.enderecoCliente.id) {
        this.carregando = false;
        this.mostrarToast('Você não tem um endereço cadastrado. Selecione "Outro endereço".', 'warning');
        return;
      }

      this.criarPedido(this.enderecoCliente.id, dataHora);
      return;
    }

    // Caso 2: endereço novo digitado no formulário.
    // Esse endereço ainda não existe no banco, então primeiro salvamos ele
    // separadamente (POST /enderecos) pra conseguir o id, e só depois criamos o pedido.
    const novoEndereco = new EnderecoModel();
    novoEndereco.cep = val.outroEndereco.cep;
    novoEndereco.rua = val.outroEndereco.rua;
    novoEndereco.numero = val.outroEndereco.numero;
    novoEndereco.complemento = val.outroEndereco.complemento;
    novoEndereco.bairro = val.outroEndereco.bairro;
    novoEndereco.cidade = val.outroEndereco.cidade;
    novoEndereco.referencia = val.outroEndereco.referencia;
    novoEndereco.idUsuario = this.cliente.id; // EnderecoRequestDTO exige esse vínculo

    this.enderecoService.salvar(novoEndereco).subscribe({
      next: (enderecoSalvo) => {
        this.criarPedido(enderecoSalvo.id, dataHora);
      },
      error: (err) => {
        console.log('Erro ao salvar endereço: ', err);
        this.carregando = false;
        this.mostrarToast('Erro ao salvar o endereço. Tente novamente.', 'danger');
      }
    });
  }

  // Monta o payload igual ao PedidoRequestDTO do backend e envia.
  // Importante: o backend NÃO espera "status" no corpo da requisição
  // (o PedidoRequestDTO não tem esse campo) - ele mesmo define o status
  // inicial do pedido ao criar. Por isso não setamos status aqui.
  private criarPedido(idEndereco: string, dataHora: Date): void {
    const pedido = new PedidoModel();
    pedido.idProfissional = this.profissional.id;
    pedido.idCliente = this.cliente.id;
    pedido.idServico = this.profissionalServico.idServico;
    pedido.preco = this.profissionalServico.preco;
    pedido.data = dataHora;
    pedido.idEndereco = idEndereco;

    this.pedidoService.salvar(pedido).subscribe({
      next: async (pedidoSalvo) => {
        this.carregando = false;
        await this.mostrarToast('Pedido enviado com sucesso!', 'success');
        this.modalController.dismiss({ pedido: pedidoSalvo, sucesso: true });
      },
      error: (err) => {
        console.log('Erro ao salvar pedido: ', err);
        this.carregando = false;
        this.mostrarToast('Erro ao enviar pedido. Tente novamente.', 'danger');
      }
    });
  }

  // ─── Ações secundárias ─────────────────────────────────────────────────────

  fechar(): void {
    this.modalController.dismiss({ sucesso: false });
  }

  // ─── Utils ─────────────────────────────────────────────────────────────────

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