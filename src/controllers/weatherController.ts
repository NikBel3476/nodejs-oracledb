import { NextFunction, Request, Response } from "express";
import { ApiError } from "../ApiError/ApiError";
import { $weatherApi } from "../thirdPartyApi";
import { db } from "../db";
import { CityWeatherInfo } from "../@types/dbmodels";
import { CityWeatherAPI } from "../@types/weatherAPI";

class WeatherController {
  async getWindStats(req: Request, res: Response, next: NextFunction) {
    const { startDate, endDate } = req.params;

    try {
      const apiRes = await $weatherApi.get<CityWeatherAPI>(
        `/timeline/${req.city.name}/${startDate}/${endDate}`
      );
      if (apiRes.data) {
        const notExistingDates = await db.getNotExistingDates(
          req.city.id,
          startDate,
          endDate
        );
        console.log(notExistingDates);
        /*const weatherInfo: CityWeatherInfo[] = [];
        apiRes.data.days.forEach((day) =>
          day.hours.forEach((hour) => {
            const date = new Date(`${day.datetime} ${hour.datetime}`);
            date.setHours(
              new Date(`${day.datetime} ${hour.datetime}`).getHours() -
                apiRes.data.tzoffset
            );
            weatherInfo.push({
              cityId: req.city.id,
              datetime: date,
              windSpeed: hour.windspeed,
              windDirection: hour.winddir,
              windGust: hour.windgust,
            });
          })
        );
        await db.weatherAddMany(weatherInfo);
        return res.json(apiRes.data);*/
      }
    } catch (e) {
      return next(ApiError.internal("Error on third party API request"));
    }
  }
}

export default new WeatherController();
