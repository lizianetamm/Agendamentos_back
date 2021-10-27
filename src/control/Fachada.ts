import EntidadeDominio from "../model/entidade/entidadeDominio";
import IFachada from "./IFachada";
import IDAO from "../model/dao/IDAO";
import UsuarioDAO from "../model/dao/UsuarioDAO";
import IStrategy from "../model/strategy/IStrategy";
import EventoDAO from "../model/dao/EventoDAO";
import ValidarExistencia from "../model/strategy/validarExistencia";
import ValidarCPF from "../model/strategy/validarCPF";
import ValidarDadosObrigatorios from "../model/strategy/validarDadosObrigatorios";

export default class Fachada implements IFachada {
  daos: Map<string, IDAO>;
  rns: Map<string, IStrategy[]>;

  constructor() {
    this.daos = new Map<string, IDAO>();
    this.rns = new Map<string, IStrategy[]>();
    this.definirDAOS();
    this.definirRNS();
  }

  definirDAOS() {
    this.daos.set("Usuario", new UsuarioDAO());
    this.daos.set("Evento", new EventoDAO());
  }

  definirRNS() {    
    let validarCpf = new ValidarCPF();
    let validarDadosObrigatorios = new ValidarDadosObrigatorios();
    let validarExistencia = new ValidarExistencia(); 
   

    this.rns.set("Usuario",
      [
        validarCpf,
        validarDadosObrigatorios,
        validarExistencia
      ]); 
      this.rns.set("Evento",[]); 
  }

 
  async processarStrategys(entidade: EntidadeDominio, altera: boolean): Promise<string> {
    let nomeClasse = entidade.constructor.name;
    let final_msg = "";
    let mensagem = [];
    for (const s of this.rns.get(nomeClasse)!) {
      final_msg = await s.processar(entidade, altera);
      if (final_msg != null) {
        mensagem.push(final_msg);
      }       
      entidade.msgn = mensagem; 
    }   
    return (mensagem.length > 0) ? final_msg: "";
  }

  async cadastrar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
    let msg = await this.processarStrategys(entidade, false); 
    
    if (msg == "") {
      let nomeClasse: string = entidade.constructor.name;
      let retorno = await this.daos.get(nomeClasse)?.salvar(entidade);
      return retorno as EntidadeDominio;
      }
      entidade.msgn   
    return entidade;
  }

  async alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
    let msg = await this.processarStrategys(entidade, true);    
    
    if (msg == "") {
      let nomeClasse: string = entidade.constructor.name;
      let retorno = await this.daos.get(nomeClasse)?.alterar(entidade,);
      return retorno as EntidadeDominio;
      }
      entidade.msgn   
    return entidade;
  }
  excluir(entidade: EntidadeDominio): boolean {
    let nomeClasse: string = entidade.constructor.name;
    this.daos.get(nomeClasse)?.excluir(entidade);
    return true;
  }
  async consultar(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
    let nomeClasse: string = entidade.constructor.name;
    return (await this.daos.get(nomeClasse)?.consultar()) ?? [];
  }
  async consultarLogin(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
    const usuario = new UsuarioDAO()
    return await usuario.consultarLogin(entidade) ?? [];
  }
  async consultarId(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
    let nomeClasse: string = entidade.constructor.name;
    return (await this.daos.get(nomeClasse)?.consultarComId(entidade)) ?? [];
  }
}
