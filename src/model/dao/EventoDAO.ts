import { db } from "../../db.config";
import EntidadeDominio from "../entidade/entidadeDominio";
import entidadeDominio from "../entidade/entidadeDominio";
import Evento from "../entidade/evento";
import Usuario from "../entidade/usuario";
import IDAO from "./IDAO";

export default class EventoDAO implements IDAO {
    async alterar(entidade: entidadeDominio): Promise<entidadeDominio> {
        const evento = entidade as Evento
        await db.query("UPDATE eventos SET descricao=$1, first=$2, second=$3 WHERE id=$4",
            [
                evento.descricao,
                evento.first,
                evento.second,
                evento.id

            ])
        return entidade as Evento;
    }
    excluir(entidade: entidadeDominio): boolean {
        const evento = entidade as Evento;
        db.query("DELETE FROM eventos WHERE id=$1", [evento.id]);
        return true;
    }
    async consultar(): Promise<entidadeDominio[]> {
        let eventos = db.query("SELECT * FROM eventos");
        let result: Array<EntidadeDominio> = [];

        result = await eventos.then((dados) => {
            return (result = dados.rows.map((evento) => {

                return evento as Evento;
            }));
        });

        return result;

    }
    async consultarComId(entidade: entidadeDominio): Promise<entidadeDominio[]> {
        const evento = entidade as Evento;
        let event = db.query("SELECT * FROM eventos WHERE fk_usuario = $1", [evento.idUsuario]);
        let result: Array<EntidadeDominio> = [];

        result = await event.then((dados) => {
            return (result = dados.rows.map((usuario) => {
                return usuario as Usuario;
            }));
        });

        return result;
    }
    async salvar(entidade: entidadeDominio): Promise<entidadeDominio> {
        const evento = entidade as Evento;
        let idEvento = await db.query(
            "INSERT INTO eventos(descricao, fk_usuario, nome, first, second) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [
                evento.descricao,
                evento.idUsuario,
                evento.nome,
                evento.first,
                evento.second
            ]
        );
        entidade.id = idEvento.rows[0].id;

        return entidade as Evento;
    }


}