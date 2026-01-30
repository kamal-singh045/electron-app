import { getMe } from "../controllers";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get('/me', authMiddleware, getMe);

export default router;
