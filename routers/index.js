import { Router } from "express";

import authRouter from "./authRouters.js";
import timelineRouter from "./timelineRouters.js";

const router = Router();

router.use(authRouter);
router.use(timelineRouter);

export default router;
