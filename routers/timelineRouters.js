import { Router } from "express";

import { validateSchema } from "../middlewares/authValidationSchema.js";
import postSchema from "../schemas/postSchema.js";
import tokenValidation from "../middlewares/tokenValidation.js";
import {
  getPosts,
  publishPost,
  updatePost,
} from "../controllers/timelineControllers.js";
import postsShemas from "../schemas/postSchema.js";

const timelineRouter = Router();

timelineRouter.post(
  "/timeline",
  validateSchema(postsShemas.postSchema),
  tokenValidation,
  publishPost
);

timelineRouter.get("/timeline", tokenValidation, getPosts);
timelineRouter.put(
  "/timeline/:id",
  validateSchema(postSchema.descriptionSchema),
  tokenValidation,
  updatePost
);

export default timelineRouter;
