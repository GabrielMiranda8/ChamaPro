export class EnderecoModel {
    id: string;
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    numero: number;
    complemento: string;
    referencia: string;
    idUsuario: string; 

    constructor(){
        this.id = "";
        this.cep = "";
        this.rua = "";
        this.bairro = "";
        this.cidade = "";
        this.numero = 0;
        this.complemento = "";
        this.referencia = "";
        this.idUsuario = "";
    }
}