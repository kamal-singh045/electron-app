import express from 'express';
import cors from 'cors';
import routes from './routes';
import { initializeDatabase } from './db/init';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
