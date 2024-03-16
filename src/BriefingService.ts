import { BriefingCreateDTO } from "./dtos/BriefingCreateDTO";
import { Briefing } from "./entity/Briefing";
import { v4 } from 'uuid';
import { BriefingState } from "./enums/BriefingState";
import { Database } from "./PostgresFunctions";
import { BriefingResponse, toBriefing } from "./dtos/BriefingResponse";
import { BriefingEditDTO } from "./dtos/BriefingEditDTO";

export type ResponseType<T> = {
    status : number,
    msg : string,
    val? : T
}

export class BriefingService{

    database : Database = new Database();

    constructor(){
    }

    initDB = async () => {
        await this.database.createTables();
    }


    createBriefing = async (dto : BriefingCreateDTO) : Promise<ResponseType<undefined>> => {

        //Garantindo que dados sejam válidos
        if(dto.clientName.trim().length == 0 || dto.description.trim().length == 0)
            return({status: 400, msg: "Nome ou descrição inválidos"});

        //Criando entidade
        const briefing : Briefing = new Briefing(dto.clientName, dto.description, new Date(), BriefingState.negociacao, undefined);

        //Criando template de resposta
        let response = {status : 200, msg : ""}

        //Fazendo requisição para criar briefing e executando callback
        //Este padrão será utilizado em outras partes do projeto
        //Ele é usado para que a gente espere que a database crie a entidade
        //  e em seguida execute o callback, que irá usar a função resolve()
        //  informando que tudo já terminou de ser executado e o fluxo pode seguir normalmente
        //Desse modo, esperamos que o programa termine a comunicação com o banco de dados para
        //  continuarmos.
        await new Promise<void>((resolve) => {
            this.database.create(briefing, (status, msg) => {
                response = {status : status, msg : msg};
                resolve();
            })
        })

        //Retornamos nossa resposta
        return response;
    }


    getAllBriefings = async () : Promise<ResponseType<Briefing[]>> => {

        //Lista de briefings do sistema, inicia vazia e será preenchida depois
        let briefings: Briefing[] = []

        //Requisição ao banco de dados para pegar todos os briefings
        return this.database.getAll().then(response => {

            if (response !== undefined) {

                //pegando resposta do BD e armazenando na
                //variável definida anteriormente
                briefings = response

                return {status : 200, msg : "Retornando com sucesso", val: briefings}
            }
            else {
                return {status: 400, msg: "Houve um erro, resposta undefined", val: undefined}
            }

        }).catch(error => {
            return {status: 400, msg: "Houve um erro: "+error , val: undefined}
        })

    }


    getBriefingByid = async (id : string) : Promise<ResponseType<BriefingResponse | undefined>> => {
        //Comunicação com o BD para recuperar um briefing por ID
        return this.database.getById(id).then(response => {
            if(response !== undefined)
                return {status : 200, msg: "Retornado com sucesso", val: response}
            else
                return {status: 400, msg: "Houve um erro"}
        }).catch(error => {
            return {status: 400, msg: "Houve um erro"+error}
        })

    }


    removeBriefing = async (id : string) : Promise<ResponseType<undefined>> => {

        //Criando response padrão, é necessária para ser enviada no final
        let removeResponse : ResponseType<undefined> = {
            status: 400,
            msg: ""
        };

        //Buscando briefing no banco de dados
        const response : BriefingResponse | undefined = await this.database.getById(id);

        //Verificando se response é válida
        //Se response for undefined -> inválida
        //Se response não for undefined, mas for apagada -> invalida
        if(response == undefined || (response !== undefined && response.deleted)){
            return {status : 400, msg: "O briefing informado não existe"};
        }

        //Convertendo response para Briefing 
        const briefing : Briefing = toBriefing(response);

        //Delete lógico
        briefing.deleted = true;

        //Assim com o create, precisamos usar esta estrutura de Promise para garantir
        //que a resposta que seja dada seja coerente com o que ocorreu na comunicação
        //com o banco de dados, desse modo, precisamos garantir que o await apenas termine
        //quando o callback for chamado.
        await new Promise<void>((resolve) => {
            this.database.save(briefing, (status : number) => {
                removeResponse = {
                    status : status,
                    msg : status == 200 ? "Briefing apagado com sucesso" : "Houve um erro ao apagar o briefing"
                }
                resolve();
            })
        })

        return removeResponse


    }


    editBriefing = async (id : string, editInfo : BriefingEditDTO) : Promise<ResponseType<Briefing | undefined>> => {


        //Busacndo briefing desejado no próprio service
        const briefingResponse : BriefingResponse | undefined = (await this.getBriefingByid(id)).val;

        //Garantindo que o briefing esteja correto
        if(briefingResponse == undefined || (briefingResponse !== undefined && briefingResponse.deleted))
            return {status: 400, msg: "Briefing informado não existe"}

        //Convertendo resposta para entidade Briefing
        let briefing : Briefing = toBriefing(briefingResponse);

        //Resposta padrão que será utilizada no final
        let response : ResponseType<Briefing | undefined> = {
            status : 400,
            msg : ""
        }

        //Garantindo que os dados não tenham mudado na conversão
        if(briefing === undefined || briefing.deleted)
            return {status : 400, msg: "O briefing informado não existe"};

        //Garantindo que nome esteja minimamente correto
        if(
            editInfo.clientName !== undefined && 
            editInfo.clientName !== null && 
            editInfo.clientName !== briefing.clientName
        ){
            if(editInfo.clientName.trim().length == 0)
                return {status : 400, msg : "Nome inválido"}
            briefing.clientName = editInfo.clientName;
        }


        //Garantindo que descrição esteja minimamente correta
        if(
            editInfo.description !== undefined && 
            editInfo.description !== null && 
            editInfo.description !== briefing.description
        ){
            if(editInfo.description.trim().length == 0)
                return {status : 400, msg : "Descrição inválida"}
            briefing.description = editInfo.description;
        }


        //Garantindo que estado esteja minimamente correto
        if(
            editInfo.state !== undefined &&
            editInfo.state != briefing.state
        ){
            briefing.state = editInfo.state;
        }

        //Assim com o create, precisamos usar esta estrutura de Promise para garantir
        //que a resposta que seja dada seja coerente com o que ocorreu na comunicação
        //com o banco de dados, desse modo, precisamos garantir que o await apenas termine
        //quando o callback for chamado.
        await new Promise<void>((resolve) => {
            this.database.save(briefing, (status : number, error? : string) => {
                response = {
                    status : status, 
                    msg : status == 200 ? "Briefing editado com sucesso" : "Houve um erro ao editar o briefing",
                    val: status == 200 ? briefing : undefined
                }
                resolve();
            })
        })


        return response;

    }

}