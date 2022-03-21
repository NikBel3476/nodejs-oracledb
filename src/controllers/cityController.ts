import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { ApiError } from "../ApiError/ApiError";
import { $weatherApi } from "../thirdPartyApi";

class CityController {
  async getOne(req: Request, res: Response, next: NextFunction) {
    const { city } = req.params;
    const resFromDB = await db.cityGetByName(city);

    if (resFromDB) {
      return res.json(resFromDB);
    }

    /*const dataFromApi = await $weatherApi.get(`/${city}`);

    if (dataFromApi.data) {
      const cityFromDb = await db.addCity(city);
      return res.json(cityFromDb);
    }*/

    return res.json(ApiError.badRequest(`City not found: ${city}`));
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const cities = await db.cityGetAll();
    return res.json(cities);
  }

  async addCity(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const data = await db.cityAddOne(name);
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

export default new CityController();
