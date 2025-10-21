import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import GeneralTimer from '../common/GeneralTimer';
import TeamCard from './TeamCard';
import ExportCSV from './ExportCSV';
import TimerConfig from './TimerConfig';
import { startSession, finishSession, updateSessionTimers } from '../../state/store';

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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 18px;
`;

const EmptyDescription = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 14px;
`;

const SessionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const CopyButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #0056b3;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const TeamsCount = styled.div`
  background: #28a745;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
`;

const SessionControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const StartButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #218838;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const FinishButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #c82333;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const SessionStatus = styled.div`
  background: ${props => {
    if (props.status === 'waiting') return '#ffc107';
    if (props.status === 'active') return '#28a745';
    if (props.status === 'finished') return '#6c757d';
    return '#6c757d';
  }};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
`;

export default function TeacherView({ session }) {
  const teams = session.teams || [];
  const scoreboard = session.scoreboard || [];
  const [isStarting, setIsStarting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [timers, setTimers] = useState(session.missionTimes || session.timers || { m1: 600, m2: 600, m3: 600, final: 480 });
  
  const copySessionCode = () => {
    navigator.clipboard.writeText(session.code);
    // Aquí podrías agregar una notificación de éxito
  };

  const handleStartSession = async () => {
    setIsStarting(true);
    try {
      await startSession(session.code);
      // La sesión se actualizará automáticamente via polling
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error al iniciar la sesión');
    } finally {
      setIsStarting(false);
    }
  };

  const handleFinishSession = async () => {
    setIsFinishing(true);
    try {
      await finishSession(session.code);
      // La sesión se actualizará automáticamente via polling
    } catch (error) {
      console.error('Error finishing session:', error);
      alert('Error al finalizar la sesión');
    } finally {
      setIsFinishing(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting': return '⏳ Esperando';
      case 'active': return '▶️ En curso';
      case 'finished': return '✅ Finalizada';
      default: return '❓ Desconocido';
    }
  };

  const handleTimersChange = async (newTimers) => {
    setTimers(newTimers);
    try {
      await updateSessionTimers(session.code, newTimers);
    } catch (error) {
      console.error('Error updating timers:', error);
      // Revert local state on error
      setTimers(session.timers);
    }
  };

  return (
    <TeacherContainer>
      <Header>
        <Title>Panel Docente</Title>
        <SessionInfo>
          <SessionCode>{session.code}</SessionCode>
          <CopyButton onClick={copySessionCode}>
            📋 Copiar
          </CopyButton>
          <TeamsCount>
            👥 {teams.length} equipos
          </TeamsCount>
          <SessionStatus status={session.status}>
            {getStatusText(session.status)}
          </SessionStatus>
        </SessionInfo>
        <GeneralTimer session={session} />
      </Header>

      {/* Configuración de Tiempos - Solo antes de iniciar */}
      {session.status === 'waiting' && (
        <Section>
          <SectionTitle>Configuración de Tiempos</SectionTitle>
          <TimerConfig 
            timers={timers}
            onTimersChange={handleTimersChange}
            disabled={session.status !== 'waiting'}
          />
        </Section>
      )}

      {/* Controles de Sesión */}
      <Section>
        <SectionTitle>Controles de Sesión</SectionTitle>
        <Card>
          <SessionControls>
            <StartButton 
              onClick={handleStartSession}
              disabled={session.status !== 'waiting' || isStarting}
            >
              {isStarting ? 'Iniciando...' : '▶️ Iniciar Sesión'}
            </StartButton>
            <FinishButton 
              onClick={handleFinishSession}
              disabled={session.status !== 'active' || isFinishing}
            >
              {isFinishing ? 'Finalizando...' : '⏹️ Finalizar Sesión'}
            </FinishButton>
            <div style={{ color: '#6c757d', fontSize: '14px' }}>
              {session.status === 'waiting' && 'Los equipos pueden unirse. Haz clic en "Iniciar Sesión" para comenzar.'}
              {session.status === 'active' && 'La sesión está en curso. Los equipos ya no pueden unirse.'}
              {session.status === 'finished' && 'La sesión ha finalizado.'}
            </div>
          </SessionControls>
        </Card>
      </Section>

      <Section>
        <SectionTitle>Scoreboard</SectionTitle>
        <Card>
          {scoreboard.length > 0 ? (
            <ScoreboardTable>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Equipo</TableHeaderCell>
                  <TableHeaderCell align="right">Puntaje</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {scoreboard.map(team => (
                  <TableRow key={team.id}>
                    <TableCell>{team.name}</TableCell>
                    <TableCell align="right">{team.score}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </ScoreboardTable>
          ) : (
            <EmptyState>
              <EmptyIcon>📊</EmptyIcon>
              <EmptyTitle>No hay equipos aún</EmptyTitle>
              <EmptyDescription>
                Los equipos aparecerán aquí cuando se unan a la sesión
              </EmptyDescription>
            </EmptyState>
          )}
        </Card>
      </Section>

      <Section>
        <SectionTitle>Equipos ({teams.length})</SectionTitle>
        {teams.length > 0 ? (
          <TeamsGrid>
            {teams.map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
          </TeamsGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyTitle>Esperando equipos</EmptyTitle>
            <EmptyDescription>
              Comparte el código de sesión con los estudiantes para que se unan
            </EmptyDescription>
          </EmptyState>
        )}
      </Section>

      <Section>
        <ExportCSV session={session} />
      </Section>
    </TeacherContainer>
  );
}

