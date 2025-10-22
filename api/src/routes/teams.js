import { z } from 'zod';
import { getSession, joinTeam, getTeam, updateTeam, onMissionCompleted } from '../store.js';
import { validateMission, validateFinal } from '../validators.js';

export default async function teamsRoutes(app) {
  app.post('/:code/join', async (req, reply) => {
    try {
      const { code } = req.params;
      const schema = z.object({ teamName: z.string().min(1) });
      const { teamName } = schema.parse(req.body || {});
      const team = joinTeam(code, teamName);
      reply.send({ team });
    } catch (error) {
      console.error('Error joining team:', error);
      if (error.message === 'SESSION_NOT_FOUND') {
        return reply.code(404).send({ error: 'SESSION_NOT_FOUND', message: 'Session not found. Please check the session code.' });
      }
      return reply.code(500).send({ error: 'INTERNAL_ERROR', message: 'Failed to join team' });
    }
  });

  app.post('/:teamId/submit/:missionKey', async (req, reply) => {
    const { teamId, missionKey } = req.params;
    const team = getTeam(teamId);
    if (!team) return reply.code(404).send({ error: 'TEAM_NOT_FOUND' });
    const session = getSession(team.code);
    const mission = session.missions.find(m => m.key === missionKey);
    if (!mission) return reply.code(400).send({ error: 'MISSION_NOT_FOUND' });

    const result = validateMission(mission.func, req.body || {});
    team.progress[missionKey].attempts += 1;
    let pointsEarned = 0;
    
    if (result.ok) {
      team.progress[missionKey].isCorrect = true;
      
      // Calcular tiempo empleado (tiempo total de la misión - tiempo restante)
      const missionTime = session.missionTimes[missionKey] || 0;
      const timeUsed = missionTime - session.totalTimeRemaining;
      team.progress[missionKey].timeUsed = Math.max(0, timeUsed);
      
      // Calcular puntos ganados para esta misión
      const oldScore = team.score;
      team.score = computeScore(session, team);
      pointsEarned = team.score - oldScore;
      
      // Avanzar a la siguiente misión si es la misión actual
      onMissionCompleted(teamId, missionKey);
    }
    updateTeam(team);
    reply.send({ ok: result.ok, details: result.details, score: team.score, pointsEarned });
  });

  app.post('/:teamId/hint/:missionKey', async (req, reply) => {
    const { teamId, missionKey } = req.params;
    const team = getTeam(teamId);
    if (!team) return reply.code(404).send({ error: 'TEAM_NOT_FOUND' });
    const session = getSession(team.code);
    team.progress[missionKey].hints += 1;
    team.score = computeScore(session, team);
    updateTeam(team);
    reply.send({ hints: team.progress[missionKey].hints, score: team.score });
  });

  app.post('/:teamId/final', async (req, reply) => {
    const { teamId } = req.params;
    const team = getTeam(teamId);
    if (!team) return reply.code(404).send({ error: 'TEAM_NOT_FOUND' });
    const session = getSession(team.code);
    const result = validateFinal(session.finalTarget.polynomial, req.body || {});
    
    // Calcular tiempo empleado para la fase final
    const missionTime = session.missionTimes.final || 0;
    const timeUsed = missionTime - session.totalTimeRemaining;
    
    let pointsEarned = 0;
    const oldScore = team.score;
    
    team.progress.final = {
      equation: req.body?.equation || '',
      justification: req.body?.justification || '',
      isCorrect: result.ok,
      timeUsed: Math.max(0, timeUsed),
      timeSec: team.progress.final.timeSec
    };
    team.score = computeScore(session, team);
    pointsEarned = team.score - oldScore;
    
    if (result.ok) {
      // Avanzar a la siguiente misión si es la fase final
      onMissionCompleted(teamId, 'final');
    }
    updateTeam(team);
    reply.send({ ok: result.ok, eqOk: result.eqOk, justificationOk: result.justificationOk, score: team.score, pointsEarned });
  });
}

function computeScore(session, team) {
  let totalScore = 0;
  
  // Calcular puntuación para cada misión
  const missions = ['m1', 'm2', 'm3', 'final'];
  missions.forEach(missionKey => {
    const mission = team.progress[missionKey];
    if (mission && mission.isCorrect) {
      // Puntos base: 10 puntos por misión
      let missionScore = 10;
      
      // Puntos adicionales por tiempo sobrante (1 punto por cada 30 segundos sobrantes)
      if (mission.timeUsed) {
        const missionTime = session.missionTimes[missionKey] || 0;
        const timeRemaining = missionTime - mission.timeUsed;
        const timeBonus = Math.floor(timeRemaining / 30);
        missionScore += timeBonus;
      }
      
      totalScore += missionScore;
    }
  });
  
  // Penalización por pistas (opcional, mantener el sistema actual si existe)
  const penalty = Object.values(team.progress).reduce((acc, p) => acc + (p?.hints||0)*(session.rules?.hintPenalty || 0), 0);
  
  return Math.max(0, totalScore - penalty);
}
