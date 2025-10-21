import styled from 'styled-components';
import Card from '../common/Card';

const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const TeamName = styled.h4`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #495057;
`;

const TeamScore = styled.div`
  background: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
`;

const ProgressList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
`;

const MissionLabel = styled.span`
  font-weight: 500;
  color: #495057;
`;

const MissionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIcon = styled.span`
  font-size: 16px;
`;

const HintsCount = styled.span`
  color: #6c757d;
  font-size: 12px;
`;

export default function TeamCard({ team }) {
  const progress = team.progress;
  
  const getStatusIcon = (isCorrect) => {
    return isCorrect ? '✅' : '❌';
  };
  
  const getStatusText = (isCorrect) => {
    return isCorrect ? 'Completado' : 'Pendiente';
  };

  return (
    <Card>
      <TeamHeader>
        <TeamName>{team.name}</TeamName>
        <TeamScore>{team.score} pts</TeamScore>
      </TeamHeader>
      
      <ProgressList>
        <ProgressItem>
          <MissionLabel>Misión 1</MissionLabel>
          <MissionStatus>
            <StatusIcon>{getStatusIcon(progress.m1.isCorrect)}</StatusIcon>
            <span>{getStatusText(progress.m1.isCorrect)}</span>
            <HintsCount>({progress.m1.hints} pistas)</HintsCount>
          </MissionStatus>
        </ProgressItem>
        
        <ProgressItem>
          <MissionLabel>Misión 2</MissionLabel>
          <MissionStatus>
            <StatusIcon>{getStatusIcon(progress.m2.isCorrect)}</StatusIcon>
            <span>{getStatusText(progress.m2.isCorrect)}</span>
            <HintsCount>({progress.m2.hints} pistas)</HintsCount>
          </MissionStatus>
        </ProgressItem>
        
        <ProgressItem>
          <MissionLabel>Misión 3</MissionLabel>
          <MissionStatus>
            <StatusIcon>{getStatusIcon(progress.m3.isCorrect)}</StatusIcon>
            <span>{getStatusText(progress.m3.isCorrect)}</span>
            <HintsCount>({progress.m3.hints} pistas)</HintsCount>
          </MissionStatus>
        </ProgressItem>
        
        <ProgressItem>
          <MissionLabel>Fase Final</MissionLabel>
          <MissionStatus>
            <StatusIcon>{getStatusIcon(progress.final.isCorrect)}</StatusIcon>
            <span>{getStatusText(progress.final.isCorrect)}</span>
          </MissionStatus>
        </ProgressItem>
      </ProgressList>
    </Card>
  );
}


