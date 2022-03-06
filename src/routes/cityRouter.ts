import { NextFunction, Request, Response, Router } from "express";
import cityController from "../controllers/cityController";

export const cityRouter = Router();

cityRouter.get("/", cityController.getAll);
cityRouter.get("/:city", cityController.getOne);

cityRouter.post("/", cityController.addCity);
