import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const TimerContainer = styled.div`
  background: linear-gradient(135deg, #8B1538 0%, #A90046 100%);
  color: white;
  padding: 24px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(139, 21, 56, 0.25);
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${props => props.urgent ? pulse : 'none'} 1s infinite;
`;

const TimerTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  opacity: 0.9;
`;

const TimeDisplay = styled.div`
  font-size: 48px;
  font-weight: 700;
  margin: 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Courier New', monospace;
`;

const MissionInfo = styled.div`
  font-size: 16px;
  font-weight: 500;
  opacity: 0.9;
  margin-top: 8px;
`;

const MissionName = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
`;

const TimeBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-top: 16px;
  overflow: hidden;
`;

const TimeProgress = styled.div`
  height: 100%;
  background: ${props => {
    if (props.percentage > 50) return '#28a745';
    if (props.percentage > 25) return '#ffc107';
    return '#dc3545';
  }};
  width: ${props => props.percentage}%;
  transition: width 1s ease-out, background-color 0.3s ease;
  border-radius: 4px;
`;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const getMissionName = (missionKey) => {
  const names = {
    m1: 'Misión 1: Análisis Básico',
    m2: 'Misión 2: Formas de la Parábola', 
    m3: 'Misión 3: Propiedades Avanzadas',
    final: 'Fase Final'
  };
  return names[missionKey] || 'Misión Desconocida';
};

export default function GeneralTimer({ session }) {
  if (!session || session.status !== 'active') {
    return null;
  }

  // Manejar casos donde los datos no están disponibles
  const totalTimeRemaining = session.totalTimeRemaining || 0;
  const currentMission = session.currentMission || 'm1';
  const missionTimes = session.missionTimes || session.timers || { m1: 600, m2: 600, m3: 600, final: 480 };
  const maxTime = missionTimes[currentMission] || 600;
  const percentage = maxTime > 0 ? (totalTimeRemaining / maxTime) * 100 : 0;
  const isUrgent = percentage < 25;

  return (
    <TimerContainer urgent={isUrgent}>
      <TimerTitle>⏰ Tiempo Restante</TimerTitle>
      <TimeDisplay>{formatTime(totalTimeRemaining)}</TimeDisplay>
      <MissionInfo>
        <MissionName>{getMissionName(currentMission)}</MissionName>
      </MissionInfo>
      <TimeBar>
        <TimeProgress percentage={percentage} />
      </TimeBar>
    </TimerContainer>
  );
}
