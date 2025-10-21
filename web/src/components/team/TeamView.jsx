import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GeneralTimer from '../common/GeneralTimer';
import MissionBox from './MissionBox';
import Mission2Box from './Mission2Box';
import Mission3Box from './Mission3Box';
import FinalPhase from './FinalPhase';
import FinalSummary from './FinalSummary';

const TeamContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #495057;
`;

const ScoreDisplay = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
`;

const MissionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MissionWrapper = styled.div`
  animation: slideIn 0.5s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LockedMission = styled.div`
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #6c757d;
  position: relative;
  overflow: hidden;
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 249, 250, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const LockIcon = styled.div`
  font-size: 48px;
  color: #adb5bd;
`;

const LockedTitle = styled.h3`
  margin: 0;
  color: #6c757d;
  font-size: 18px;
`;

const LockedDescription = styled.p`
  margin: 0;
  color: #adb5bd;
  font-size: 14px;
`;

const ProgressIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const ProgressDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.completed ? '#28a745' : props.current ? '#007bff' : '#dee2e6'};
  transition: all 0.3s ease;
`;

const UnlockNotification = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  animation: slideIn 0.5s ease-out;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
`;

const WaitingMessage = styled.div`
  background: linear-gradient(135deg, #ffc107 0%, #ff8c00 100%);
  color: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
`;

const WaitingIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const WaitingTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
`;

const WaitingDescription = styled.p`
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
`;

export default function TeamView({ session, team }) {
  const progress = team.progress;
  const [unlockedMissions, setUnlockedMissions] = useState({
    m1: true,
    m2: false,
    m3: false,
    final: false
  });
  const [showUnlockNotification, setShowUnlockNotification] = useState(null);
  
  // Determinar qué misiones están disponibles
  const isMission1Available = session.currentMission === 'm1' || session.currentMission === 'm2' || session.currentMission === 'm3' || session.currentMission === 'final';
  const isMission2Available = session.currentMission === 'm2' || session.currentMission === 'm3' || session.currentMission === 'final';
  const isMission3Available = session.currentMission === 'm3' || session.currentMission === 'final';
  const isFinalAvailable = session.currentMission === 'final';

  // Debug logs
  console.log('🔍 TeamView Debug:', {
    currentMission: session.currentMission,
    isMission1Available,
    isMission2Available,
    isMission3Available,
    isFinalAvailable
  });

  // Detectar cuando se desbloquea una nueva misión
  useEffect(() => {
    const newUnlocked = {
      m1: session.currentMission === 'm1' || session.currentMission === 'm2' || session.currentMission === 'm3' || session.currentMission === 'final',
      m2: session.currentMission === 'm2' || session.currentMission === 'm3' || session.currentMission === 'final',
      m3: session.currentMission === 'm3' || session.currentMission === 'final',
      final: session.currentMission === 'final'
    };

    // Detectar cambios en el desbloqueo
    if (newUnlocked.m2 && !unlockedMissions.m2) {
      setShowUnlockNotification('🎉 ¡Misión 2 desbloqueada!');
      setTimeout(() => setShowUnlockNotification(null), 3000);
    }
    if (newUnlocked.m3 && !unlockedMissions.m3) {
      setShowUnlockNotification('🎉 ¡Misión 3 desbloqueada!');
      setTimeout(() => setShowUnlockNotification(null), 3000);
    }
    if (newUnlocked.final && !unlockedMissions.final) {
      setShowUnlockNotification('🎉 ¡Fase Final desbloqueada!');
      setTimeout(() => setShowUnlockNotification(null), 3000);
    }

    setUnlockedMissions(newUnlocked);
  }, [progress.m1.isCorrect, progress.m2.isCorrect, progress.m3.isCorrect, unlockedMissions]);

  const getMissionStatus = (missionKey) => {
    const mission = progress[missionKey];
    if (mission.isCorrect) return 'completed';
    
    // Si la misión expiró por tiempo, mostrar como no superada
    if (mission.timeExpired || mission.status === 'time_expired') {
      return 'time_expired';
    }
    
    // Si la sesión no está activa, solo M1 está disponible
    if (session.status !== 'active') {
      return missionKey === 'm1' ? 'available' : 'locked';
    }
    
    const missionOrder = ['m1', 'm2', 'm3', 'final'];
    const currentIndex = missionOrder.indexOf(missionKey);
    const currentMissionIndex = missionOrder.indexOf(session.currentMission || 'm1');
    
    // Debug logging
    if (missionKey === 'm2') {
      console.log('🔍 M2 Status Check:', {
        missionKey,
        currentMission: session.currentMission,
        currentIndex,
        currentMissionIndex,
        status: currentIndex <= currentMissionIndex ? 'available' : 'locked'
      });
    }
    
    // La misión actual y las anteriores están disponibles
    if (currentIndex <= currentMissionIndex) {
      return 'available';
    }
    
    // Si la misión anterior está completada, está disponible
    if (currentIndex > 0) {
      const previousMission = missionOrder[currentIndex - 1];
      if (progress[previousMission]?.isCorrect) {
        return 'available';
      }
    }
    
    return 'locked';
  };

  // Si la sesión no ha comenzado, mostrar mensaje de espera
  if (session.status === 'waiting') {
    return (
      <TeamContainer>
        <Header>
          <Title>Equipo: {team.name}</Title>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <ScoreDisplay>
              🏆 {team.score} puntos
            </ScoreDisplay>
          </div>
        </Header>

        <WaitingMessage>
          <WaitingIcon>⏳</WaitingIcon>
          <WaitingTitle>Esperando a que inicie la sesión</WaitingTitle>
          <WaitingDescription>
            El docente aún no ha iniciado la sesión. Las misiones estarán disponibles una vez que comience.
          </WaitingDescription>
        </WaitingMessage>
      </TeamContainer>
    );
  }

  // Si la sesión ha terminado, mostrar resumen final
  if (session.status === 'finished') {
    return <FinalSummary team={team} session={session} />;
  }

  return (
    <TeamContainer>
      <Header>
        <Title>Equipo: {team.name}</Title>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <ScoreDisplay>
            🏆 {team.score} puntos
          </ScoreDisplay>
        </div>
      </Header>

      <GeneralTimer session={session} />

      <ProgressIndicator>
        <ProgressDot 
          completed={progress.m1.isCorrect} 
          current={session.currentMission === 'm1'} 
        />
        <ProgressDot 
          completed={progress.m2.isCorrect} 
          current={session.currentMission === 'm2'} 
        />
        <ProgressDot 
          completed={progress.m3.isCorrect} 
          current={session.currentMission === 'm3'} 
        />
        <ProgressDot 
          completed={progress.final.isCorrect} 
          current={session.currentMission === 'final'} 
        />
      </ProgressIndicator>

      {/* Notificación de desbloqueo */}
      {showUnlockNotification && (
        <UnlockNotification>
          {showUnlockNotification}
        </UnlockNotification>
      )}

      <MissionsContainer>
        
        {/* Mostrar solo la misión actual según session.currentMission */}
        {session.currentMission === 'm1' && (
          <MissionWrapper>
            <Mission3Box 
              title="Misión 1: Detectives de la Parábola" 
              missionKey="m1"
              teamId={team.id}
              description="Analiza la parábola f(x) = -x² + 4x - 3. Determina los puntos clave de su gráfica y comportamiento."
              status={getMissionStatus('m1')}
            />
          </MissionWrapper>
        )}
        
        {session.currentMission === 'm2' && (
          <MissionWrapper>
            <Mission2Box 
              title="Misión 2: Detectores de Forma" 
              missionKey="m2"
              teamId={team.id}
              description="Estudia la parábola f(x) = x² - 6x + 8. Determina su forma factorizada y forma canónica (vértice)."
              status={getMissionStatus('m2')}
            />
          </MissionWrapper>
        )}
        
        {session.currentMission === 'm3' && (
          <MissionWrapper>
            <Mission3Box 
              title="Misión 3: Grafiquen la Salvación" 
              missionKey="m3"
              teamId={team.id}
              description="Analiza la parábola f(x) = 2x² - 8x + 6. Determina los puntos clave de su gráfica y comportamiento."
              status={getMissionStatus('m3')}
            />
          </MissionWrapper>
        )}
        
        {session.currentMission === 'final' && (
          <MissionWrapper>
            <FinalPhase teamId={team.id} teamProgress={team.progress} />
          </MissionWrapper>
        )}
      </MissionsContainer>
    </TeamContainer>
  );
}

