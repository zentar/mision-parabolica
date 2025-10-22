import { z } from 'zod';
import { createSession, getSessionState, tickSession, startSession, finishSession, updateSessionTimers } from '../store.js';
import { equationSets } from '../mission-configs.js';

export default async function sessionsRoutes(app) {
  // Endpoint para obtener los conjuntos de ecuaciones disponibles
  app.get('/equation-sets', async (req, reply) => {
    const sets = Object.keys(equationSets).map(key => ({
      key,
      name: key === 'basic' ? 'Básico' : key === 'intermediate' ? 'Intermedio' : 'Avanzado',
      description: key === 'basic' ? 'Ecuaciones simples para principiantes' : 
                   key === 'intermediate' ? 'Ecuaciones de dificultad media' : 
                   'Ecuaciones complejas para estudiantes avanzados',
      missions: equationSets[key].length
    }));
    reply.send({ sets });
  });

  app.post('/', async (req, reply) => {
    const schema = z.object({
      teacherName: z.string().min(1),
      timers: z.object({ m1:z.number().int().positive(), m2:z.number().int().positive(), m3:z.number().int().positive(), final:z.number().int().positive() }).partial().optional(),
      allowPartial: z.boolean().optional(),
      hintPenalty: z.number().int().nonnegative().optional(),
      equationSet: z.enum(['basic', 'intermediate', 'advanced']).optional()
    });
    const body = schema.parse(req.body || {});
    const session = createSession(body.teacherName, body);
    tickSession(session.code); // Start timers
    reply.send({ code: session.code, state: getSessionState(session.code) });
  });

  app.get('/:code/state', async (req, reply) => {
    const { code } = req.params;
    const state = getSessionState(code);
    if (!state) return reply.code(404).send({ error: 'SESSION_NOT_FOUND' });
    reply.send(state);
  });

  app.post('/:code/start', async (req, reply) => {
    const { code } = req.params;
    try {
      const success = startSession(code);
      if (!success) {
        return reply.code(404).send({ error: 'SESSION_NOT_FOUND' });
      }
      reply.send({ success: true, message: 'Session started' });
    } catch (error) {
      reply.code(500).send({ error: 'Failed to start session' });
    }
  });

  app.post('/:code/finish', async (req, reply) => {
    const { code } = req.params;
    try {
      const success = finishSession(code);
      if (!success) {
        return reply.code(404).send({ error: 'SESSION_NOT_FOUND' });
      }
      reply.send({ success: true, message: 'Session finished' });
    } catch (error) {
      reply.code(500).send({ error: 'Failed to finish session' });
    }
  });

  app.put('/:code/timers', async (req, reply) => {
    const { code } = req.params;
    const schema = z.object({
      m1: z.number().int().min(0).optional(),
      m2: z.number().int().min(0).optional(),
      m3: z.number().int().min(0).optional(),
      final: z.number().int().min(0).optional()
    });
    
    try {
      const body = schema.parse(req.body || {});
      const success = updateSessionTimers(code, body);
      if (!success) {
        return reply.code(400).send({ error: 'Cannot update timers - session may have already started' });
      }
      reply.send({ success: true, message: 'Timers updated' });
    } catch (error) {
      reply.code(400).send({ error: 'Invalid timer values' });
    }
  });
}
