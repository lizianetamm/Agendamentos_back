import IDAO from './IDAO';
import EntidadeDominio from '../entidade/entidadeDominio';
import { db } from '../../db.config';
import Usuario from '../entidade/usuario';
import { Encrypt } from '../../utils/encrypt';
import Evento from '../entidade/evento';
import EventoDAO from './EventoDAO';

export default class UsuarioDAO implements IDAO {
    async salvar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        const usuario = entidade as Usuario;
        usuario.senha = await Encrypt.cryptPassword(usuario.senha!);
        let idUsuario = await db.query(
            "INSERT INTO usuarios (nome, cpf, sexo, telefone, email, senha, data_nasc)VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
            [
                usuario.nome,
                usuario.cpf,
                usuario.sexo,
                usuario.telefone,
                usuario.email,
                usuario.senha,
                usuario.dataNasc,
            ]
        );

        entidade.id = idUsuario.rows[0].id;

        return entidade as Usuario;

    }

    alterar(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        throw new Error('Method not implemented.');
    }
    excluir(entidade: EntidadeDominio): boolean {
        throw new Error('Method not implemented.');
    }
    async consultar(): Promise<Array<EntidadeDominio>> {
        let usuarios = db.query("SELECT * FROM usuarios");
        let result: Array<EntidadeDominio> = [];

        result = await usuarios.then((dados) => {
            return (result = dados.rows.map((usuario) => {

                return usuario as Usuario;
            }));
        });

        return result;
    }
    async consultarCpf(entidade: EntidadeDominio): Promise<EntidadeDominio> {
        const usuario = entidade as Usuario;
        let usuarios = db.query("SELECT * FROM usuarios WHERE cpf = $1", [usuario.cpf]);
        let result: any;

        result = await usuarios.then((dados) => {
            return (result = dados.rows.map((usuario) => {
                return usuario as Usuario;
            }));
        });
        return result;

    }
    async consultarLogin(entidade: EntidadeDominio): Promise<Array<EntidadeDominio>> {
        const usuario = entidade as Usuario;
        let mensagem = [];

        let usuarios = db.query("SELECT * FROM usuarios WHERE email = $1", [
            usuario.email,
        ]);

        let result: any;

        result = await usuarios.then((dados) => {
            return (result = dados.rows.map((usuario) => {

                return usuario as Usuario;
            }));
        });

        if (result.length < 1) {
            mensagem.push("Email não cadastrado");
            result.msgn = mensagem
            return result
        }

        let senhaBD = result[0].senha

        if (await Encrypt.comparePassword(usuario.senha!, senhaBD)) {
            let eventoDAO = new EventoDAO();
            let evento = Object.assign(new Evento());
            evento.idUsuario = result[0].id;
            result.eventos = await eventoDAO.consultarComId(evento as Evento);
            return result;
        }

        mensagem.push("Dados não conferem");
        result.msgn = mensagem

        return result;
    }
    async consultarComId(entidade: EntidadeDominio): Promise<EntidadeDominio[]> {
        const usuario = entidade as Usuario;
        let usuarios = db.query("SELECT * FROM usuarios WHERE id = $1", [
            usuario.id,
        ]);
        let result: any;


        result = await usuarios.then((dados) => {
            return (result = dados.rows.map((usuario) => {

                return usuario as Usuario;
            }));
        });
        let eventoDAO = new EventoDAO();
        let evento = Object.assign(new Evento());
        evento.idUsuario = result[0].id;
        result.eventos = await eventoDAO.consultarComId(evento as Evento);



        return result



    }
}

