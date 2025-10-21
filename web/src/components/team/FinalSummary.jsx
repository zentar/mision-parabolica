import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
`;

const TeamName = styled.h2`
  margin: 0 0 16px 0;
  font-size: 28px;
  font-weight: 700;
`;

const FinalScore = styled.div`
  font-size: 48px;
  font-weight: 700;
  margin: 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 32px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  opacity: 0.9;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const MissionProgress = styled.div`
  background: white;
  color: #333;
  padding: 24px;
  border-radius: 12px;
  margin-top: 24px;
`;

const MissionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const MissionName = styled.span`
  font-weight: 600;
  color: #495057;
`;

const MissionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIcon = styled.span`
  font-size: 20px;
`;

const StatusText = styled.span`
  font-weight: 600;
  color: ${props => props.completed ? '#28a745' : '#dc3545'};
`;

const TimeInfo = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-top: 4px;
`;

export default function FinalSummary({ team, session }) {
  const progress = team.progress;
  const completedMissions = Object.values(progress).filter(p => p.isCorrect).length;
  const totalHints = Object.values(progress).reduce((sum, p) => sum + (p.hints || 0), 0);
  
  const missions = [
    { key: 'm1', name: 'Misión 1: Análisis Básico', progress: progress.m1 },
    { key: 'm2', name: 'Misión 2: Formas de la Parábola', progress: progress.m2 },
    { key: 'm3', name: 'Misión 3: Propiedades Avanzadas', progress: progress.m3 },
    { key: 'final', name: 'Fase Final', progress: progress.final }
  ];

  const getMissionStatus = (mission) => {
    if (mission.isCorrect) {
      return { icon: '✅', text: 'Completado', completed: true };
    }
    return { icon: '❌', text: 'No completado', completed: false };
  };

  return (
    <SummaryContainer>
      <SummaryCard>
        <TeamName>🏆 {team.name}</TeamName>
        <div style={{ fontSize: '18px', opacity: 0.9, marginBottom: '16px' }}>
          Resumen Final de la Sesión
        </div>
        <FinalScore>{team.score} puntos</FinalScore>
        
        <StatsGrid>
          <StatCard>
            <StatTitle>Misiones Completadas</StatTitle>
            <StatValue>{completedMissions}/4</StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Pistas Utilizadas</StatTitle>
            <StatValue>{totalHints}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Puntuación Final</StatTitle>
            <StatValue>{team.score}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Estado</StatTitle>
            <StatValue>
              {completedMissions === 4 ? '🎉 ¡Completado!' : '⏳ Parcial'}
            </StatValue>
          </StatCard>
        </StatsGrid>
      </SummaryCard>

      <MissionProgress>
        <h3 style={{ margin: '0 0 20px 0', color: '#495057' }}>Progreso por Misión</h3>
        {missions.map(mission => {
          const status = getMissionStatus(mission.progress);
          return (
            <MissionItem key={mission.key}>
              <MissionName>{mission.name}</MissionName>
              <MissionStatus>
                <StatusIcon>{status.icon}</StatusIcon>
                <StatusText completed={status.completed}>
                  {status.text}
                </StatusText>
                {mission.progress.hints > 0 && (
                  <TimeInfo>({mission.progress.hints} pistas)</TimeInfo>
                )}
              </MissionStatus>
            </MissionItem>
          );
        })}
      </MissionProgress>
    </SummaryContainer>
  );
}
