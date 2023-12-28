import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.js";
import { getPostsById } from "../controllers/userControllers.js";

const userRouter = Router();

userRouter.get("/user/:id", tokenValidation, getPostsById);

export default userRouter;
