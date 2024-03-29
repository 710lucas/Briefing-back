import { Pool } from 'pg';
import { Briefing } from './entity/Briefing';
import { BriefingResponse } from './dtos/BriefingResponse';

export const pool = new Pool({
    user: process.env.POSTGRES_USER || "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    database : process.env.POSTGRES_DB || "briefing",
    password : process.env.POSTGRES_PASSWORD || "postgres",
    port : process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432
});

export class Database{
    constructor(){

    }

    async createTables(){
        try{
            await pool.query(
                ` 
                CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'state') THEN
                        CREATE TYPE state AS ENUM ('Negociação', 'Aprovado', 'Finalizado');
                        RAISE NOTICE 'Tipo "state" criado com sucesso.';
                    ELSE
                        RAISE NOTICE 'Tipo "state" já existe.';
                    END IF;
                END$$;

                CREATE TABLE IF NOT EXISTS public.briefings(
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    client_name VARCHAR(255),
                    description VARCHAR(1500),
                    date TIMESTAMP,
                    state state,
                    deleted BOOLEAN
                );
                `
            )
        }
        catch(error){
            console.log("Houve um erro ao criar a tabela briefings", error)
        }
    }

    create = (briefing : Briefing, callback : (status : number, message : string) => void) => {

        return pool.query(
            "INSERT INTO briefings (client_name, description, date, state, deleted) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [briefing.clientName, briefing.description, briefing.date, briefing.state, briefing.deleted],
            (err, res) =>{
                if(err){
                    console.log("Houve um erro ao inserir o ", briefing, " na tabela briefings");
                    console.log(err);
                    callback(400, "Houve um erro ao criar o briefing");
                } 
                else{
                    console.log("Briefing adicionado com sucesso: ", res.rows[0])
                    callback(200, "Briefing criado com sucesso")
                }
            }
        )
    }
    
    save = (briefing : Briefing, callback : (status : number, message : string) => void) => {

        return pool.query(
            "UPDATE briefings SET client_name = $1, description = $2, date = $3, state = $4, deleted = $5 WHERE id = $6;",
            [briefing.clientName, briefing.description, briefing.date, briefing.state, briefing.deleted, briefing.id],
            (err, res) =>{
                if(err){
                    callback(400, "houve um erro ao salvar o briefing");
                } 
                else{
                    callback(200, "Briefing salvo com sucesso");
                }
            }
        )
    }

    getAll = () : Promise<Briefing[] | undefined> => {
        return pool.query<Briefing>("SELECT * FROM briefings WHERE deleted = false")
        .then(response => response.rows)
        .catch(error => {
            console.log("Houve um erro ao recuperar todos os briefings", error);
            return []
        });
    }

    getById = (id : string) : Promise<BriefingResponse | undefined> => {
        return pool.query<BriefingResponse>("SELECT * FROM briefings WHERE ID = $1 AND deleted = false", [id])
        .then(response => {
            if(response.rowCount == 0){
                return undefined;
            }
            else{
                return response.rows[0]
            }
        })
        .catch(error => {
            console.log("Houve um erro ao recuperar o briefing desejado", error);
            return undefined
        });
    }

}
