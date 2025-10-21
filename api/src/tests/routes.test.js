import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import sessionsRoutes from '../routes/sessions.js';
import teamsRoutes from '../routes/teams.js';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler.js';

describe('API Routes', () => {
  let app;
  let sessionCode;
  let teamId;

  beforeAll(async () => {
    app = Fastify({ logger: false });
    await app.register(cors, { origin: 'http://localhost:5173', credentials: true });
    
    app.register(sessionsRoutes, { prefix: '/sessions' });
    app.register(teamsRoutes, { prefix: '/teams' });
    
    app.setErrorHandler(errorHandler);
    app.setNotFoundHandler(notFoundHandler);
    
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Sessions Routes', () => {
    test('POST /sessions - should create a new session', async () => {
      const response = await request(app.server)
        .post('/sessions')
        .send({
          teacherName: 'Test Teacher'
        })
        .expect(200);

      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('state');
      expect(response.body.state).toHaveProperty('code');
      expect(response.body.state).toHaveProperty('status', 'running');
      
      sessionCode = response.body.code;
    });

    test('POST /sessions - should validate required fields', async () => {
      const response = await request(app.server)
        .post('/sessions')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message');
    });

    test('GET /sessions/:code/state - should return session state', async () => {
      const response = await request(app.server)
        .get(`/sessions/${sessionCode}/state`)
        .expect(200);

      expect(response.body).toHaveProperty('code', sessionCode);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('teams');
      expect(response.body).toHaveProperty('scoreboard');
    });

    test('GET /sessions/:code/state - should return 404 for non-existent session', async () => {
      const response = await request(app.server)
        .get('/sessions/INVALID/state')
        .expect(404);

      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('type', 'SESSION_NOT_FOUND');
    });
  });

  describe('Teams Routes', () => {
    test('POST /teams/:code/join - should allow team to join session', async () => {
      const response = await request(app.server)
        .post(`/teams/${sessionCode}/join`)
        .send({
          teamName: 'Test Team'
        })
        .expect(200);

      expect(response.body).toHaveProperty('team');
      expect(response.body.team).toHaveProperty('id');
      expect(response.body.team).toHaveProperty('name', 'Test Team');
      expect(response.body.team).toHaveProperty('score', 0);
      
      teamId = response.body.team.id;
    });

    test('POST /teams/:code/join - should validate team name', async () => {
      const response = await request(app.server)
        .post(`/teams/${sessionCode}/join`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', true);
    });

    test('POST /teams/:teamId/submit/:missionKey - should submit mission answer', async () => {
      const response = await request(app.server)
        .post(`/teams/${teamId}/submit/m1`)
        .send({
          vertex: { x: -2, y: -1 },
          yIntercept: 3,
          roots: [-1, -3],
          concavity: 'up',
          axis: -2,
          range: [-1, null]
        })
        .expect(200);

      expect(response.body).toHaveProperty('ok');
      expect(response.body).toHaveProperty('details');
      expect(response.body).toHaveProperty('score');
    });

    test('POST /teams/:teamId/hint/:missionKey - should request hint', async () => {
      const response = await request(app.server)
        .post(`/teams/${teamId}/hint/m1`)
        .expect(200);

      expect(response.body).toHaveProperty('hints');
      expect(response.body).toHaveProperty('score');
      expect(response.body.hints).toBeGreaterThan(0);
    });

    test('POST /teams/:teamId/final - should submit final answer', async () => {
      const response = await request(app.server)
        .post(`/teams/${teamId}/final`)
        .send({
          equation: '(x-2)^2',
          justification: 'Trinomio cuadrado perfecto, raíz doble'
        })
        .expect(200);

      expect(response.body).toHaveProperty('ok');
      expect(response.body).toHaveProperty('eqOk');
      expect(response.body).toHaveProperty('justificationOk');
      expect(response.body).toHaveProperty('score');
    });

    test('POST /teams/:teamId/submit/:missionKey - should return 404 for non-existent team', async () => {
      const response = await request(app.server)
        .post('/teams/INVALID/submit/m1')
        .send({})
        .expect(404);

      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('type', 'TEAM_NOT_FOUND');
    });

    test('POST /teams/:teamId/submit/:missionKey - should return 400 for non-existent mission', async () => {
      const response = await request(app.server)
        .post(`/teams/${teamId}/submit/invalid`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('type', 'MISSION_NOT_FOUND');
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 for non-existent routes', async () => {
      const response = await request(app.server)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', true);
      expect(response.body).toHaveProperty('message');
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app.server)
        .post('/sessions')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('error', true);
    });
  });
});


