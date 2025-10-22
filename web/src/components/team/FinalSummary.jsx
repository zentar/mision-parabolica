import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, #8B1538 0%, #A90046 100%);
  color: white;
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 24px;
  box-shadow: 0 12px 40px rgba(139, 21, 56, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
  margin-top: 40px;
`;

const StatCard = styled.div`
  background: rgba(139, 21, 56, 0.1);
  backdrop-filter: blur(15px);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(139, 21, 56, 0.3);
  box-shadow: 0 4px 20px rgba(139, 21, 56, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(139, 21, 56, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 21, 56, 0.2);
  }
`;

const StatusCard = styled.div`
  background: rgba(139, 21, 56, 0.15);
  backdrop-filter: blur(15px);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(139, 21, 56, 0.3);
  box-shadow: 0 4px 20px rgba(139, 21, 56, 0.15);
  transition: all 0.3s ease;
  margin-top: 24px;
  text-align: center;
  
  &:hover {
    background: rgba(139, 21, 56, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 21, 56, 0.2);
  }
`;

const StatTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
  
  // Calcular tiempo total empleado
  const calculateTotalTime = () => {
    const totalTime = Object.values(progress).reduce((total, mission) => {
      if (mission.timeUsed) {
        return total + mission.timeUsed;
      }
      return total;
    }, 0);
    return totalTime;
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };
  
  const totalTimeUsed = calculateTotalTime();
  
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
            <StatTitle>Tiempo Total</StatTitle>
            <StatValue>{formatTime(totalTimeUsed)}</StatValue>
          </StatCard>
          
          <StatCard>
            <StatTitle>Puntuación Final</StatTitle>
            <StatValue>{team.score}</StatValue>
          </StatCard>
        </StatsGrid>
        
        <StatusCard>
          <StatTitle>Estado</StatTitle>
          <StatValue>
            {completedMissions === 4 ? '🎉 ¡Completado!' : '⏳ Parcial'}
          </StatValue>
        </StatusCard>
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
                {mission.progress.timeUsed && (
                  <TimeInfo>({formatTime(mission.progress.timeUsed)})</TimeInfo>
                )}
              </MissionStatus>
            </MissionItem>
          );
        })}
      </MissionProgress>
    </SummaryContainer>
  );
}
