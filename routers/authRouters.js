import { Router } from "express";

import { validateSchema } from "../middlewares/authValidationSchema.js";
import signInSchema from "../schemas/signInSchema.js";
import signUpSchema from "../schemas/signUpSchema.js";
import { signIn, signUp } from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post("/signUp", validateSchema(signUpSchema), signUp);
authRouter.post("/signIn", validateSchema(signInSchema), signIn);

export default authRouter;
