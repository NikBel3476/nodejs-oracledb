import { NextFunction, Request, Response } from "express";
import { db } from "../db";
import { ApiError } from "../ApiError/ApiError";
import { $weatherApi } from "../thirdPartyApi";

class CityController {
  async getOne(req: Request, res: Response, next: NextFunction) {
    const { city } = req.params;
    const resFromDB = await db.getCityByName(city);

    if (resFromDB) {
      return res.json(resFromDB);
    }

    const dataFromApi = await $weatherApi.get(`/${city}`);

    if (dataFromApi.data) {
    }

    return res.json(ApiError.badRequest(`Wrong city name: ${city}`));
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const cities = await db.getAllCities();
    return res.json(cities);
  }

  async addCity(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const data = await db.addCity(name);
      return res.json(data);
    } catch (e) {
      console.log("error");
      next(e);
    }
  }
}

export default new CityController();
