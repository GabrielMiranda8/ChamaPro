import { EnderecoModel } from "./endereco.model";

export class PedidoModel {
    id: string;
    data: Date;
    preco: number;
    status: string;
    endereco!: EnderecoModel; 
    idProfissional: string;
    idServico: string;
    idCliente: string;
    idEndereco: string; 
    nomeServico: string;
    nomeCliente: string;
    nomeProfissional: string;

    constructor(){
        this.id = "";
        this.data = new Date();
        this.preco = 0;
        this.status = "";
        this.idProfissional = "";
        this.idServico = "";
        this.idCliente = "";
        this.idEndereco = "";
        this.nomeServico = "";
        this.nomeCliente = "";
        this.nomeProfissional = "";
    }
}