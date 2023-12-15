import { Router } from "express";

import { validateSchema } from "../middlewares/authValidationSchema.js";
import postSchema from "../schemas/postSchema.js";
import tokenValidation from "../middlewares/tokenValidation.js";
import { publishPost } from "../controllers/timelineControllers.js";

const timelineRouter = Router();

timelineRouter.post(
  "/timeline",
  validateSchema(postSchema),
  tokenValidation,
  publishPost
);

export default timelineRouter;
