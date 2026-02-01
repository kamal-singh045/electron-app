import express from 'express';
import cors from 'cors';
import routes from './routes';
import { initializeDatabase } from './db/init';
import { app as electronApp } from 'electron';

const app = express();
const PORT = 3001;
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

      app.listen(PORT, () => {
        console.log(`✅ Express server running on http://localhost:${PORT}`)
        resolve()
      })
    } catch (error) {
      console.error('❌ Failed to start server:', error)
      reject(error)
    }
  })
}

export default app;
