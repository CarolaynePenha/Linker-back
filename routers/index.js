import { Router } from "express";

import authRouter from "./authRouters.js";

const router = Router();

router.use(authRouter);

export default router;
