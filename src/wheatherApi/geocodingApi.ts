import { $geocoding } from "./index";
import {geocodingResponse} from "../types/geocoding/geocodingResponse";
import {geoCoordinates} from "../types/geocoding/geoCoordinates";

export const getCityCoordinates = async (name: string): Promise<geoCoordinates[]> => {
    const response = await $geocoding.get<geocodingResponse[]>('/direct', {
        params: {
            q: name
        }
    });
    return response.data.map(data => { return { lat: data.lat, lon: data.lon }});
}
