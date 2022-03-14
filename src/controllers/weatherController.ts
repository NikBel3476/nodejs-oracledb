import { NextFunction, Response } from "express";
import { RequestWithCity } from "../interfaces/RequestWithCity";
import { ApiError } from "../ApiError/ApiError";
import { $weatherApi } from "../thirdPartyApi";

class WeatherController {
  async getWindStats(req: RequestWithCity, res: Response, next: NextFunction) {
    const { startDate, endDate } = req.params;
    if (!req.city) {
      return next(ApiError.badRequest("Incorrect city name"));
    }
    const weatherRes = await $weatherApi.get(
      `/timeline/${req.city.name}/${startDate}/${endDate}`
    );
    if (weatherRes.data) {
      return res.json(weatherRes.data);
    }
    return next(ApiError.internal("Something went wrong"));
  }
}

export default new WeatherController();
