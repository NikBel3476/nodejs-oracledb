import { DayWeatherAPI } from "./DayWeatherAPI";

export interface CityWeatherAPI {
  days: DayWeatherAPI[];
  tzoffset: number;
}
