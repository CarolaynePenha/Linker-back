import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.js";
import { deleteRePost, saveRePost } from "../controllers/rePostControllers.js";

const rePostRouter = Router();

rePostRouter.post("/repost/:postId", tokenValidation, saveRePost);
rePostRouter.delete("/repost/:rePostId", tokenValidation, deleteRePost);

export default rePostRouter;
