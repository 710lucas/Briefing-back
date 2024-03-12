import { Briefing } from "../entity/Briefing"
import { BriefingState } from "../enums/BriefingState"

export type BriefingResponse = {
    id: string,
    client_name : string,
    description : string,
    date : Date,
    state : BriefingState,
    deleted : boolean
}

export function toBriefing(response : BriefingResponse) : Briefing{
    return {
            id: response.id,
            clientName: response.client_name,
            date: response.date,
            deleted : response.deleted,
            description: response.description,
            state: response.state
    };
}
export function toBriefingResponse(response : Briefing) : BriefingResponse{
    return {
            id: response.id,
            client_name: response.clientName,
            date: response.date,
            deleted : response.deleted,
            description: response.description,
            state: response.state
    };
}