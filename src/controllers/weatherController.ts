import { NextFunction, Request, Response } from "express";
import { RequestWithCity } from "../interfaces/RequestWithCity";
import { ApiError } from "../ApiError/ApiError";
import { $weatherApi } from "../thirdPartyApi";
import { db } from "../db";
import { dayWeatherInfo } from "../@types/dbtypes";

class WeatherController {
  async getWindStats(req: Request, res: Response, next: NextFunction) {
    const { startDate, endDate } = req.params;

    try {
      const weatherRes = await $weatherApi.get(
        `/timeline/${req.city.name}/${startDate}/${endDate}`
      );
      if (weatherRes.data) {
        const days: dayWeatherInfo[] = weatherRes.data.days.map((day: any) => {
          return {
            city_id: req.city.id,
            created_at: new Date(day.datetime),
            wind_speed: day.windspeed,
            wind_direction: day.winddir,
            wind_gust: day.windgust,
          };
        });
        await db.weatherAddMany(days);
        return res.json(weatherRes.data);
      }
    } catch (e) {
      return next(ApiError.internal("Something went wrong"));
    }
  }
}

export default new WeatherController();
