import {localNames} from "./localNames";

export type geocodingResponse = {
    name: string;
    local_names: localNames;
    lat: number;
    lon: number;
    country: string;
    state: string
}
