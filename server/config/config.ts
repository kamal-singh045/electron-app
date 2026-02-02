import dotenv from 'dotenv';
dotenv.config();

export const serverConfig = {
  port: process.env.PORT || 3000,
  imagesBaseDir: process.env.IMAGES_BASE_DIR || 'images',
  apiUrl: process.env.API_URL || 'http://localhost:3000'
}
