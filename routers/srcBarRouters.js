import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.js";
import { validateSchema } from "../middlewares/authValidationSchema.js";
import srcSchema from "../schemas/srcSchema.js";
import { getSrcNames } from "../controllers/srcControllers.js";

const SrcBarRouter = Router();

SrcBarRouter.get(
  "/srcBar",
  validateSchema(srcSchema),
  tokenValidation,
  getSrcNames
);

export default SrcBarRouter;
