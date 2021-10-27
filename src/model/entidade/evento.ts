import EntidadeDominio from "./entidadeDominio";

export default class Evento extends EntidadeDominio {
    nome!: string;
    descricao!: string;
    horaInicio!: number;
    horaTermino!: number; 
    idUsuario!: number;   
    first!: any;
    second!: any;

}