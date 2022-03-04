import { NextFunction, Request, Response } from "express";

class WeatherController {
  async getData(req: Request, res: Response, next: NextFunction) {}
}

export default new WeatherController();
