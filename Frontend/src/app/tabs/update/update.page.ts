import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import {
  IonContent, IonButton, IonIcon, IonInput,
  IonLabel, IonToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline } from 'ionicons/icons';
import { forkJoin } from 'rxjs';

import { UsuarioService } from 'src/app/services/usuario.service';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { TokenModel } from 'src/app/model/token.model';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    IonContent, IonButton, IonIcon, IonInput, IonLabel, IonToggle
  ],
})
export class UpdatePage implements OnInit {
  formGroup: FormGroup;
  dados: UsuarioModel = new UsuarioModel();
  token!: TokenModel;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private toastController: ToastController,
    private navController: NavController
  ) {
    addIcons({ arrowBackOutline, calendarOutline });

    // 1. Inicializa os campos normalmente (sem "disabled: true")
    this.formGroup = this.formBuilder.group({
      nome: [''],
      email: [''],
      cpf: [''],
      dtNasc: [''],
      cidadeEstado: [''],
      cep: [''],
      senha: ['']
    });
  }

  ngOnInit(): void {
    this.token = this.tokenService.extrair();
    this.carregarDados();
  }

  carregarDados() {
    this.usuarioService.buscarPorId(this.token.id).subscribe({
      next: (usuario) => {
        this.dados = usuario;
        console.log("Usuario: ", usuario);
        
        let dataNascStr = '';
        if (usuario.dtNasc) {
          const data = new Date(usuario.dtNasc);
          dataNascStr = data.toLocaleDateString('pt-BR');
        }

        const localidade = `${usuario.endereco?.cidade || ''} - ${usuario.endereco?.bairro || ''}`;

        // 2. Preenche os dados recebidos da API
        this.formGroup.patchValue({
          nome: usuario.nome,
          email: usuario.email,
          cpf: usuario.cpf,
          dtNasc: dataNascStr,
          cidadeEstado: localidade,
          cep: usuario.endereco?.cep,
          senha: '' 
        });

        // 3. Só AGORA desabilita o formulário inteiro
        this.formGroup.disable();
      },
      error: (err) => {
        console.log('Erro ao carregar dados:', err);
        this.exibirMensagem('Erro ao carregar os dados do perfil.');
      },
    });
  }

  obterIniciais(nome: string): string {
    if (!nome) return '??';
    return nome
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0])
      .join('')
      .toUpperCase();
  }

  voltar() {
    this.navController.back();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    
    if (this.isEditing) {
      // Habilita apenas CEP e Senha para edição
      this.formGroup.get('cep')?.enable();
      this.formGroup.get('senha')?.enable();
    } else {
      // Desabilita os campos novamente e reseta para os valores originais
      this.formGroup.get('cep')?.disable();
      this.formGroup.get('senha')?.disable();
      this.formGroup.get('cep')?.setValue(this.dados.endereco?.cep);
      this.formGroup.get('senha')?.setValue('');
    }
  }

  salvarAlteracoes() {
    const cepAtualizado = this.formGroup.get('cep')?.value;
    const novaSenha = this.formGroup.get('senha')?.value;

    const chamadas = [];

    if (novaSenha && novaSenha.trim().length >= 3) {
      chamadas.push(this.usuarioService.alterarSenha(this.dados.id, novaSenha));
    }

    if (cepAtualizado && cepAtualizado !== this.dados.endereco?.cep) {
      chamadas.push(this.usuarioService.alterarCep(this.dados.id, cepAtualizado));
    }

    if (chamadas.length === 0) {
      this.toggleEdit();
      return;
    }

    forkJoin(chamadas).subscribe({
      next: () => {
        this.exibirMensagem('Dados atualizados com sucesso!');
        if(this.dados.endereco) {
            this.dados.endereco.cep = cepAtualizado; 
        }
        this.toggleEdit(); 
      },
      error: (err) => {
        console.log('Erro ao atualizar:', err);
        this.exibirMensagem('Erro ao atualizar os dados.');
      }
    });
  }

  mascaraCep(event: Event) {
    let valor = (event.target as HTMLInputElement).value;
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    this.formGroup.patchValue({ cep: valor }, { emitEvent: false });
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