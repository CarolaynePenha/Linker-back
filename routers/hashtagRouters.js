import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.js";
import { getPostByHashtag } from "../controllers/hashtagControllers.js";

const hashtagRouter = Router();

hashtagRouter.get("/hashtag/:hashtag", tokenValidation, getPostByHashtag);

export default hashtagRouter;
