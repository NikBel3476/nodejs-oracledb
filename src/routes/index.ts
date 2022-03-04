import { Router } from "express";
import weatherRouter from "./weatherRouter";

export const router = Router();

router.use("/weather", weatherRouter);
