import { Request } from "express";
import { City } from "../db/dbtypes";

export interface RequestWithCity extends Request {
  city?: City;
}
