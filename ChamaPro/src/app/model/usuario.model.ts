import { CaracteristicaModel } from "./caracteristica.model";
import { EnderecoModel } from "./endereco.model";

export class UsuarioModel {
    id: string;
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    dtNasc: string;
    dtConta: string;
    nota: number
    tipo: string;
    endereco: EnderecoModel;
    caracteristicas: CaracteristicaModel[];

    constructor(){
        this.id = "";
        this.nome = "";
        this.email = "";
        this.senha = "";
        this.cpf = "";
        this.dtNasc = "";
        this.dtConta = new Date().toISOString();
        this.nota = 0;
        this.tipo = "";
        this.endereco = new EnderecoModel();
        this.caracteristicas = [];
    }
}
