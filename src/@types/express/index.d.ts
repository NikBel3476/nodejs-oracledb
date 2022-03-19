import { City } from "../dbtypes";

declare global {
  namespace Express {
    interface Request {
      city: City;
    }
  }
}
