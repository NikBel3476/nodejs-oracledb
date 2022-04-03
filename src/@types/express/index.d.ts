import { City } from "../dbmodels";

declare global {
  namespace Express {
    interface Request {
      city: City;
    }
  }
}
