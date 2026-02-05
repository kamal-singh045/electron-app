import dotenv from 'dotenv';
dotenv.config();

export const serverConfig = {
  port: process.env.PORT || 3000,
  profileImagesBaseDir: process.env.PROFILE_IMAGES_BASE_DIR || 'profile_images',
  todoImagesBaseDir: process.env.TODO_IMAGES_BASE_DIR || 'todo_images',
  screenshotsDir: process.env.SCREENSHOTS_BASE_DIR || 'screenshots',
  apiUrl: process.env.API_URL || 'http://localhost:3000'
}
