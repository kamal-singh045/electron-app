import { getMe, updateMe, uploadProfileImage } from "../controllers";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload-image.middleware";

const router = Router();

router.get('/me', authMiddleware, getMe);
router.post('/me/upload-profile', authMiddleware, upload.single('file'), uploadProfileImage);
router.put('/me', authMiddleware, updateMe);

export default router;
