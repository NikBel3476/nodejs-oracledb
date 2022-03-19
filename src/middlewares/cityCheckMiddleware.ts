import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { ApiError } from "../ApiError/ApiError";
import { RequestWithCity } from "../interfaces/RequestWithCity";

export const cityCheckMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { city } = req.params;

  const cityData = await db.cityGetByName(city);

  if (!cityData) {
    return next(ApiError.badRequest(`Wrong city name: ${city}`));
  }

  req.city = cityData;
  return next();
};
