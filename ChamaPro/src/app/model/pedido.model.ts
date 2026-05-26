import { ClienteModel } from "./cliente.model";
import { EnderecoModel } from "./endereco.model";
import { ProfissionalModel } from "./profissional.model";
import { ServicoModel } from "./servico.model";

export class PedidoModel {
    id: string;
    data: Date;
    preco: number;
    status: string;
    endereco!: EnderecoModel;
    profissional!: ProfissionalModel;
    servico!: ServicoModel;
    cliente!: ClienteModel;

    constructor(){
        this.id = "";
        this.data = new Date();
        this.preco = 0;
        this.status = "";
    }
}
