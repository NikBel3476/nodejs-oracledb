import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { ApiError } from "../ApiError/ApiError";

class CityController {
  async getOne(req: Request, res: Response, next: NextFunction) {
    const { city } = req.params;
    const resFromDB = await db.cityGetByName(city);

    if (resFromDB) {
      return res.json(resFromDB);
    }

    return res.json(ApiError.badRequest(`City not found: ${city}`));
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const cities = await db.cityGetAll();
    return res.json(cities);
  }

  async addOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const data = await db.cityAddOne(name);
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const data = await db.cityDeleteOne(Number(id));
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

export default new CityController();
