import { BriefingState } from "../enums/BriefingState";

export class Briefing{

    id          : string;
    clientName  : string;
    description : string;
    date        : Date;
    state       : BriefingState;

    constructor(id : string, clientName : string, description : string, date : Date, state : BriefingState){
        this.id = id;
        this.clientName = clientName;
        this.description = description;
        this.date = date;
        this.state = state;
    }

}