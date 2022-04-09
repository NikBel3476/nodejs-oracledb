import { Router } from "express";
import weatherController from "../controllers/weatherController";
import { cityCheckMiddleware } from "../middlewares/cityCheckMiddleware";

const router = Router();

router.get(
  "/timeline/:city/:startDatetime/:endDatetime",
  cityCheckMiddleware,
  weatherController.getWindStats
);

export default router;
