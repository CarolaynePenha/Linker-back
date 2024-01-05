import { Router } from "express";

import authRouter from "./authRouters.js";
import timelineRouter from "./timelineRouters.js";
import userRouter from "./userRouter.js";
import SrcBarRouter from "./srcBarRouters.js";
import hashtagRouter from "./hashtagRouters.js";
import commentsRouter from "./commentsRouter.js";

const router = Router();

router.use(authRouter);
router.use(timelineRouter);
router.use(userRouter);
router.use(SrcBarRouter);
router.use(hashtagRouter);
router.use(commentsRouter);

export default router;
