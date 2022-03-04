import { Router } from "express";
import weatherController from "../controllers/weatherController";

const router = Router();

router.get("/:city/:startDate/:endDate", weatherController.getWindStats);

export default router;
