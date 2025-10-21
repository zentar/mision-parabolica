import Fastify from 'fastify';
import cors from '@fastify/cors';
import sessionsRoutes from './routes/sessions.js';
import teamsRoutes from './routes/teams.js';
import { bus, getSessionState } from './store.js';

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

async function startServer() {
  const app = Fastify({ logger: true });

  // Register CORS
  await app.register(cors, { 
    origin: CORS_ORIGIN, 
    credentials: true 
  });

  // Register routes
  await app.register(sessionsRoutes, { prefix: '/sessions' });
  await app.register(teamsRoutes, { prefix: '/teams' });

  // Health check
  app.get('/health', async () => ({ ok: true, timestamp: Date.now() }));

  // Start server
  await app.listen({ 
    port: PORT, 
    host: '0.0.0.0' 
  });

  console.log(`✅ Server listening on http://localhost:${PORT}`);
}

// Start the server
startServer().catch((err) => {
  console.error('❌ Error starting server:', err);
  process.exit(1);
});