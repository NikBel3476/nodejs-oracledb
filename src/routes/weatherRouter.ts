import { Router } from "express";
import weatherController from "../controllers/weatherController";
import { cityCheckMiddleware } from "../middlewares/cityCheckMiddleware";

const router = Router();

router.get(
  "/timeline/:city/:startDate/:endDate",
  cityCheckMiddleware,
  weatherController.getWindStats
);

export default router;
