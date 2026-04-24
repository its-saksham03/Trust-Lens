import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { globalLimiter } from './backend/src/middleware/rateLimiter';
import { errorHandler } from './backend/src/middleware/errorHandler';
import apiRouter from './backend/src/routes';
import { seedDatabase } from './backend/src/seed';

async function startServer() {
  const app = express();
  // AI Studio infrastructure hard-codes PORT=3000
  const PORT = process.env.PORT || 3000;

  // IMPORTANT: Disable Helmet CSP for local Vite compatibility, or configure properly
  app.use(helmet({ contentSecurityPolicy: false }));
  
  const origin = process.env.CORS_ORIGIN || '*';
  app.use(cors({ origin }));
  app.use(express.json());

  // Apply Global Rate Limiting
  app.use('/api', globalLimiter);

  // Mount Backend API Routes
  app.use('/api', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  // Try to seed database async
  if(process.env.DATABASE_URL && process.env.DATABASE_URL !== 'postgres://dummy:dummy@dummy.neon.tech/dummy?sslmode=require') {
      seedDatabase();
  }

  // Vite Middleware Setup for Frontend Simulation
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TrustLens Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
