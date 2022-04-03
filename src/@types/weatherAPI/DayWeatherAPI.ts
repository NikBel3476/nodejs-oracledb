import { HourWeatherAPI } from "./HourWeatherAPI";

export interface DayWeatherAPI {
  datetime: string;
  hours: HourWeatherAPI[];
}
