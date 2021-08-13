import { DateTime} from "luxon";

export interface Time {
    /** Luxon DateTime lib */
    DateTime: typeof DateTime;
}

export const time: Time = {
    DateTime,
}
