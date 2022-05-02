import { Router } from "express";
import cityController from "../controllers/cityController";

export const cityRouter = Router();

cityRouter.get("/", cityController.getAll);
cityRouter.get("/:city", cityController.getOne);
cityRouter.post("/", cityController.addOne);
cityRouter.put("/:id", cityController.updateOne);
cityRouter.delete("/:id", cityController.deleteOne);
