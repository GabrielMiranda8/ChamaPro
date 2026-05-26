import { ProfissionalModel } from "./profissional.model";
import { ServicoModel } from "./servico.model";

export class ProfissionalServicoModel {
    id: string;
    servico!: ServicoModel;
    profissional!: ProfissionalModel;
    preco: number;
    tempoCarreira: Date;

    constructor(){
        this.id = "";
        this.preco = 0;
        this.tempoCarreira = new Date;
    }
}
