import { Briefing } from "./entity/Briefing";

export const getBriefignById = (id : string, briefings : Briefing[]) : Briefing | undefined => {

    const briefing : Briefing | undefined = briefings.find(
        briefing => briefing.id === id && !briefing.deleted
    );

    return briefing;

}