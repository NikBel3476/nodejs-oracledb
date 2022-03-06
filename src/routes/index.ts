import { Router } from "express";
import weatherRouter from "./weatherRouter";
import { cityRouter } from "./cityRouter";

export const router = Router();

router.use("/weather", weatherRouter);
router.use("/cities", cityRouter);
