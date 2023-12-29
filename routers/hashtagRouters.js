import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.js";
import {
  getHashtagTrending,
  getPostByHashtag,
} from "../controllers/hashtagControllers.js";

const hashtagRouter = Router();

hashtagRouter.get("/hashtag/:hashtag", tokenValidation, getPostByHashtag);
hashtagRouter.get("/trending", tokenValidation, getHashtagTrending);

export default hashtagRouter;
