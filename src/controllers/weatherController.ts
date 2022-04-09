import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { ApiError } from "../ApiError/ApiError";
import { $weatherApi } from "../thirdPartyApi";
import { db } from "../db";
import { CityWeatherInfo } from "../@types/dbmodels";
import { CityWeatherAPI } from "../@types/weatherAPI";

class WeatherController {
  async getWindStats(req: Request, res: Response, next: NextFunction) {
    const { startDatetime, endDatetime } = req.params;
    const startDate = moment(startDatetime).format("YYYY-MM-DDTHH:mm:ss");
    const endDate = moment(endDatetime).format("YYYY-MM-DDTHH:mm:ss");

    try {
      const notExistingDates = await db.getNotExistingDates(
        req.city.id,
        startDate,
        endDate
      );

      if (
        notExistingDates &&
        notExistingDates[0].MIN_DATETIME &&
        notExistingDates[0].MAX_DATETIME
      ) {
        const startDatetimeToFetch = moment(
          notExistingDates[0].MIN_DATETIME
        ).format("YYYY-MM-DD");
        const endDatetimeToFetch = moment(
          notExistingDates[0].MAX_DATETIME
        ).format("YYYY-MM-DD");
        const apiRes = await $weatherApi.get<CityWeatherAPI>(
          `/timeline/${req.city.name}/${startDatetimeToFetch}/${endDatetimeToFetch}`
        );
        if (apiRes.data) {
          const weatherInfo: CityWeatherInfo[] = [];
          apiRes.data.days.forEach((day) =>
            day.hours.forEach((hour) => {
              weatherInfo.push({
                cityId: req.city.id,
                datetime: moment(`${day.datetime} ${hour.datetime}`)
                  .subtract(req.city.tzOffset, "hours")
                  .toDate(),
                windSpeed: hour.windspeed,
                windDirection: hour.winddir,
                windGust: hour.windgust,
              });
            })
          );
          await db.weatherAddMany(weatherInfo);
        }
        return res.json(apiRes.data);
      }
    } catch (e) {
      return next(ApiError.internal("Error on third party API request"));
    }
  }
}

export default new WeatherController();
