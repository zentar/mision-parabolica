import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticFiles from '@fastify/static';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sessionsRoutes from './routes/sessions.js';
import teamsRoutes from './routes/teams.js';
import { bus, getSessionState } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

async function startServer() {
  const app = Fastify({ logger: true });

  // Register CORS
  await app.register(cors, { 
    origin: CORS_ORIGIN, 
    credentials: true 
  });

  // Register static files (frontend)
  await app.register(staticFiles, {
    root: join(__dirname, '../dist'),
    prefix: '/'
  });

  // Register API routes
  await app.register(sessionsRoutes, { prefix: '/sessions' });
  await app.register(teamsRoutes, { prefix: '/teams' });

  // Health check
  app.get('/health', async () => ({ ok: true, timestamp: Date.now() }));

  // Fallback for React Router (SPA)
  app.setNotFoundHandler((request, reply) => {
    // If it's an API route, return 404
    if (request.url.startsWith('/sessions') || request.url.startsWith('/teams')) {
      reply.code(404).send({ error: 'Not found' });
      return;
    }
    // For all other routes, serve index.html
    reply.sendFile('index.html');
  });

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