import { Router } from "express";
import tokenValidation from "../middlewares/tokenValidation.js";
import {
  following,
  getAllFollowers,
  getFollowersIds,
} from "../controllers/followControllers.js";

const followRouter = Router();

followRouter.get("/follow/:id", tokenValidation, getFollowersIds);
followRouter.get("/follow", tokenValidation, getAllFollowers);
followRouter.post("/follow/:id", tokenValidation, following);

export default followRouter;
