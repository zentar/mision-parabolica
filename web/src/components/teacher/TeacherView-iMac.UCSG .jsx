import styled from 'styled-components';
import Card from '../common/Card';
import TimerPanel from '../common/TimerPanel';
import TeamCard from './TeamCard';
import ExportCSV from './ExportCSV';

const TeacherContainer = styled.div`
  max-width: 1200px;
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

const SessionCode = styled.code`
  background: #e9ecef;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  color: #007bff;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #495057;
`;

const ScoreboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }
  
  &:hover {
    background: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  text-align: ${props => props.align || 'left'};
  border-bottom: 1px solid #e9ecef;
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: ${props => props.align || 'left'};
  font-weight: 600;
  color: #495057;
  background: #f8f9fa;
`;

const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

export default function TeacherView({ session }) {
  return (
    <TeacherContainer>
      <Header>
        <Title>Panel Docente</Title>
        <SessionCode>{session.code}</SessionCode>
        <TimerPanel timers={session.timers} />
      </Header>

      <Section>
        <SectionTitle>Scoreboard</SectionTitle>
        <Card>
          <ScoreboardTable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Equipo</TableHeaderCell>
                <TableHeaderCell align="right">Puntaje</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {session.scoreboard?.map(team => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell align="right">{team.score}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </ScoreboardTable>
        </Card>
      </Section>

      <Section>
        <SectionTitle>Equipos</SectionTitle>
        <TeamsGrid>
          {session.teams?.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </TeamsGrid>
      </Section>

      <Section>
        <ExportCSV session={session} />
      </Section>
    </TeacherContainer>
  );
}


