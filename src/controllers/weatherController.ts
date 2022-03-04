import { NextFunction, Request, Response } from "express";
import { db } from "../db";

class WeatherController {
  async getWindStats(
    req: Request<{ city: string; startDate: Date; endDate: Date }>,
    res: Response,
    next: NextFunction
  ) {
    const { city, startDate, endDate } = req.params;

    const cityData = await db.getCity(city);

    return res.json(cityData);
  }
}

export default new WeatherController();
