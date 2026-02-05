import { app } from 'electron';
import path from 'node:path';
import multer from 'multer';
import { serverConfig } from '../config/config';

const uploadDir = path.join(app.getPath('userData'), serverConfig.profileImagesBaseDir);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });
