import { Response } from "express";
import { RequestWithCity } from "../interfaces/RequestWithCity";

class WeatherController {
  async getWindStats(req: RequestWithCity, res: Response) {
    const { startDate, endDate } = req.params;

    return res.json(req.city);
  }
}

export default new WeatherController();
