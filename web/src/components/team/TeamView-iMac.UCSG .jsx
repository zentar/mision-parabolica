import styled from 'styled-components';
import TimerPanel from '../common/TimerPanel';
import MissionBox from './MissionBox';
import FinalPhase from './FinalPhase';

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

const MissionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export default function TeamView({ session, team }) {
  return (
    <TeamContainer>
      <Header>
        <Title>Equipo: {team.name}</Title>
        <TimerPanel timers={session.timers} />
      </Header>

      <MissionsContainer>
        <MissionBox 
          title="Misión 1" 
          missionKey="m1"
          teamId={team.id}
          description="Encuentra el vértice, raíces y propiedades de la parábola"
        />
        
        <MissionBox 
          title="Misión 2" 
          missionKey="m2"
          teamId={team.id}
          description="Analiza la forma factorizada y canónica"
        />
        
        <MissionBox 
          title="Misión 3" 
          missionKey="m3"
          teamId={team.id}
          description="Determina el rango y concavidad"
        />
        
        <FinalPhase teamId={team.id} />
      </MissionsContainer>
    </TeamContainer>
  );
}


