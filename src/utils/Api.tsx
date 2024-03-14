export enum BriefingState{
    negociacao = "Negociação",
    finalizado = "Finalizado",
    aprovado = "Aprovado"
}

export type BriefingType = {

    id : string,
    client_name : string,
    description : string,
    state : BriefingState,
    date : Date,
    deleted : boolean

}

export type BriefingCreateDTO = {
    clientName? : string,
    description? : string
}

export type BriefingEditDTO = BriefingCreateDTO & {
    state?: BriefingState
}



const API_URL = import.meta.env.API_URL || "http://localhost:3000/api"

export class Api{

    create(dto : BriefingCreateDTO){

        return fetch(API_URL+"/briefing", {
            method: "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(dto)
        })

    }

    getAll(){

        return fetch(API_URL+"/briefing", {
            method: "GET",
        })

    }

    getById(id : string){

        return fetch(API_URL+"/briefing/"+id, {
            method: "GET",
        })

    }

    update(id : string, dto : BriefingEditDTO){

        return fetch(API_URL+"/briefing/"+id, {
            method: "PATCH",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                clientName : dto.clientName,
                description : dto.description,
                state : dto.state
            })
        })

    }

    delete(id : string){

        return fetch(API_URL+"/briefing/"+id, {
            method: "DELETE",
        })

    }

}