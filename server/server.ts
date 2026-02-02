import express from 'express';
import cors from 'cors';
import routes from './routes';
import { initializeDatabase } from './db/init';
import { app as electronApp } from 'electron';
import { serverConfig } from './config/config';

const app = express();
const userDataPath = electronApp.getPath('userData');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/static', express.static(userDataPath));

// Routes
app.use('/api', routes);

// Start server
export function startServer() {
  return new Promise<void>((resolve, reject) => {
    try {
      // Initialize database
      initializeDatabase()

      app.listen(serverConfig.port, () => {
        console.log(`✅ Express server running on http://localhost:${serverConfig.port}`)
        resolve()
      })
    } catch (error) {
      console.error('❌ Failed to start server:', error)
      reject(error)
    }
  })
}

export default app;
