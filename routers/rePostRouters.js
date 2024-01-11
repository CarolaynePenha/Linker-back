import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.js";
import { saveRePost } from "../controllers/rePostControllers.js";

const rePostRouter = Router();

rePostRouter.post("/repost/:postId", tokenValidation, saveRePost);

export default rePostRouter;
