import styled from 'styled-components';
import Card from '../common/Card';

const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TeamName = styled.h4`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #495057;
`;

const TeamScore = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
`;

const ProgressList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProgressItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${props => {
    if (props.completed) return '#d4edda';
    if (props.timeExpired) return '#fff3cd';
    return '#f8f9fa';
  }};
  border-radius: 8px;
  font-size: 14px;
  border: ${props => {
    if (props.completed) return '2px solid #28a745';
    if (props.timeExpired) return '2px solid #ffc107';
    return '2px solid transparent';
  }};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MissionLabel = styled.span`
  font-weight: 600;
  color: ${props => {
    if (props.completed) return '#155724';
    if (props.timeExpired) return '#856404';
    return '#495057';
  }};
`;

const MissionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIcon = styled.span`
  font-size: 18px;
  animation: ${props => props.completed ? 'bounce 0.6s ease' : 'none'};
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-4px);
    }
    60% {
      transform: translateY(-2px);
    }
  }
`;

const StatusText = styled.span`
  font-weight: 500;
  color: ${props => {
    if (props.completed) return '#155724';
    if (props.timeExpired) return '#856404';
    return '#6c757d';
  }};
`;

const HintsCount = styled.span`
  color: #6c757d;
  font-size: 12px;
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 12px;
`;

const TeamStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #007bff;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-top: 2px;
`;

export default function TeamCard({ team }) {
  const progress = team.progress;
  
  const getStatusIcon = (mission) => {
    if (mission.isCorrect) return '✅';
    if (mission.timeExpired || mission.status === 'time_expired') return '⏰';
    return '⏳';
  };
  
  const getStatusText = (mission) => {
    if (mission.isCorrect) return 'Completado';
    if (mission.timeExpired || mission.status === 'time_expired') return 'Tiempo agotado';
    return 'En progreso';
  };

  const completedMissions = Object.values(progress).filter(p => p.isCorrect).length;
  const totalHints = Object.values(progress).reduce((sum, p) => sum + (p.hints || 0), 0);

  return (
    <Card>
      <TeamHeader>
        <TeamName>{team.name}</TeamName>
        <TeamScore>🏆 {team.score} pts</TeamScore>
      </TeamHeader>
      
      <ProgressList>
        <ProgressItem 
          completed={progress.m1.isCorrect}
          timeExpired={progress.m1.timeExpired || progress.m1.status === 'time_expired'}
        >
          <MissionLabel 
            completed={progress.m1.isCorrect}
            timeExpired={progress.m1.timeExpired || progress.m1.status === 'time_expired'}
          >
            Misión 1
          </MissionLabel>
          <MissionStatus>
            <StatusIcon completed={progress.m1.isCorrect}>
              {getStatusIcon(progress.m1)}
            </StatusIcon>
            <StatusText 
              completed={progress.m1.isCorrect}
              timeExpired={progress.m1.timeExpired || progress.m1.status === 'time_expired'}
            >
              {getStatusText(progress.m1)}
            </StatusText>
            {progress.m1.hints > 0 && (
              <HintsCount>{progress.m1.hints} pistas</HintsCount>
            )}
          </MissionStatus>
        </ProgressItem>
        
        <ProgressItem 
          completed={progress.m2.isCorrect}
          timeExpired={progress.m2.timeExpired || progress.m2.status === 'time_expired'}
        >
          <MissionLabel 
            completed={progress.m2.isCorrect}
            timeExpired={progress.m2.timeExpired || progress.m2.status === 'time_expired'}
          >
            Misión 2
          </MissionLabel>
          <MissionStatus>
            <StatusIcon completed={progress.m2.isCorrect}>
              {getStatusIcon(progress.m2)}
            </StatusIcon>
            <StatusText 
              completed={progress.m2.isCorrect}
              timeExpired={progress.m2.timeExpired || progress.m2.status === 'time_expired'}
            >
              {getStatusText(progress.m2)}
            </StatusText>
            {progress.m2.hints > 0 && (
              <HintsCount>{progress.m2.hints} pistas</HintsCount>
            )}
          </MissionStatus>
        </ProgressItem>
        
        <ProgressItem 
          completed={progress.m3.isCorrect}
          timeExpired={progress.m3.timeExpired || progress.m3.status === 'time_expired'}
        >
          <MissionLabel 
            completed={progress.m3.isCorrect}
            timeExpired={progress.m3.timeExpired || progress.m3.status === 'time_expired'}
          >
            Misión 3
          </MissionLabel>
          <MissionStatus>
            <StatusIcon completed={progress.m3.isCorrect}>
              {getStatusIcon(progress.m3)}
            </StatusIcon>
            <StatusText 
              completed={progress.m3.isCorrect}
              timeExpired={progress.m3.timeExpired || progress.m3.status === 'time_expired'}
            >
              {getStatusText(progress.m3)}
            </StatusText>
            {progress.m3.hints > 0 && (
              <HintsCount>{progress.m3.hints} pistas</HintsCount>
            )}
          </MissionStatus>
        </ProgressItem>
        
        <ProgressItem 
          completed={progress.final.isCorrect}
          timeExpired={progress.final.timeExpired || progress.final.status === 'time_expired'}
        >
          <MissionLabel 
            completed={progress.final.isCorrect}
            timeExpired={progress.final.timeExpired || progress.final.status === 'time_expired'}
          >
            Fase Final
          </MissionLabel>
          <MissionStatus>
            <StatusIcon completed={progress.final.isCorrect}>
              {getStatusIcon(progress.final)}
            </StatusIcon>
            <StatusText 
              completed={progress.final.isCorrect}
              timeExpired={progress.final.timeExpired || progress.final.status === 'time_expired'}
            >
              {getStatusText(progress.final)}
            </StatusText>
          </MissionStatus>
        </ProgressItem>
      </ProgressList>

      <TeamStats>
        <StatItem>
          <StatValue>{completedMissions}/4</StatValue>
          <StatLabel>Misiones</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{totalHints}</StatValue>
          <StatLabel>Pistas</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{team.score}</StatValue>
          <StatLabel>Puntos</StatLabel>
        </StatItem>
      </TeamStats>
    </Card>
  );
}

