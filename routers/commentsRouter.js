import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.js";
import { saveComments } from "../controllers/commentsControllers.js";
import { validateSchema } from "../middlewares/authValidationSchema.js";
import commentSchema from "../schemas/commentSchema.js";

const commentsRouter = Router();

commentsRouter.post(
  "/comments/:postId",
  validateSchema(commentSchema),
  tokenValidation,
  saveComments
);

export default commentsRouter;
