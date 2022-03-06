import { Request } from "express";
import { City } from "../types/dbtypes";

export interface RequestWithCity extends Request {
  city?: City;
}
