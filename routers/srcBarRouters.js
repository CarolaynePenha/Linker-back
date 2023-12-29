import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.js";
import { getSrcNames } from "../controllers/srcControllers.js";

const SrcBarRouter = Router();

SrcBarRouter.get("/srcBar", tokenValidation, getSrcNames);

export default SrcBarRouter;
