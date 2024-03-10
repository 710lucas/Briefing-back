import { BriefingState } from "../enums/BriefingState";
import { BriefingCreateDTO } from "./BriefingCreateDTO";

export type BriefingEditDTO = BriefingCreateDTO & {
    id: string,
    state : BriefingState
}