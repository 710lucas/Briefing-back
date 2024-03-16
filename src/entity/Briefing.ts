import { BriefingState } from "../enums/BriefingState";

export class Briefing{

    id?          : string;
    clientName  : string;
    description : string;
    date        : Date;
    state       : BriefingState;
    deleted     : boolean;

    constructor(clientName : string, description : string, date : Date, state : BriefingState, id?: string){
        this.id = id;
        this.clientName = clientName;
        this.description = description;
        this.date = date;
        this.state = state;
        this.deleted = false;
    }

}