import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import { createSession, getState, joinTeam } from '../../state/store';

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const FormCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #495057;
`;

const FormDescription = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Button)`
  flex: 1;
  min-width: 120px;
`;

const SecondaryButton = styled(Button)`
  background: #6c757d;
  
  &:hover {
    background: #545b62;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectLabel = styled.label`
  font-weight: 500;
  color: #495057;
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #A90046;
    box-shadow: 0 0 0 3px rgba(169, 0, 70, 0.1);
  }
`;

const SelectDescription = styled.small`
  color: #6c757d;
  font-size: 12px;
`;

export default function SessionForm({ onSessionCreated, onTeamJoined }) {
  const [teacherName, setTeacherName] = useState('Profe');
  const [sessionCode, setSessionCode] = useState('');
  const [teamName, setTeamName] = useState('Equipo 1');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [equationSets, setEquationSets] = useState([]);
  const [selectedEquationSet, setSelectedEquationSet] = useState('basic');

  // Cargar conjuntos de ecuaciones disponibles
  useEffect(() => {
    const loadEquationSets = async () => {
      try {
        const response = await fetch('/sessions/equation-sets');
        const data = await response.json();
        setEquationSets(data.sets);
      } catch (error) {
        console.error('Error loading equation sets:', error);
        // Fallback a conjuntos básicos
        setEquationSets([
          { key: 'basic', name: 'Básico', description: 'Ecuaciones simples para principiantes' },
          { key: 'intermediate', name: 'Intermedio', description: 'Ecuaciones de dificultad media' },
          { key: 'advanced', name: 'Avanzado', description: 'Ecuaciones complejas para estudiantes avanzados' }
        ]);
      }
    };
    loadEquationSets();
  }, []);

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const result = await createSession(teacherName, { equationSet: selectedEquationSet });
      onSessionCreated?.(result);
    } catch (error) {
      console.error('Error creating session:', error);
      alert(`Error al crear la sesión: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinTeam = async () => {
    setIsJoining(true);
    try {
      await getState(sessionCode);
      const result = await joinTeam(sessionCode, teamName);
      onTeamJoined?.(result);
    } catch (error) {
      console.error('Error joining team:', error);
      if (error.message === 'SESSION_ALREADY_STARTED') {
        alert('❌ No se puede unir a esta sesión porque ya ha comenzado. Contacta al docente.');
      } else if (error.message === 'SESSION_NOT_FOUND') {
        alert('❌ Sesión no encontrada. Verifica el código de sesión.');
      } else {
        alert(`❌ Error al unirse al equipo: ${error.message}`);
      }
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <FormContainer>
      <FormCard>
        <FormTitle>👨‍🏫 Crear Sesión (Docente)</FormTitle>
        <FormDescription>
          Crea una nueva sesión de juego y comparte el código con los equipos.
        </FormDescription>
        
        <Input
          label="Nombre del Docente"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          placeholder="Ingresa tu nombre"
        />
        
        <SelectContainer>
          <SelectLabel>Nivel de Dificultad</SelectLabel>
          <Select
            value={selectedEquationSet}
            onChange={(e) => setSelectedEquationSet(e.target.value)}
          >
            {equationSets.map(set => (
              <option key={set.key} value={set.key}>
                {set.name}
              </option>
            ))}
          </Select>
          <SelectDescription>
            {equationSets.find(s => s.key === selectedEquationSet)?.description}
          </SelectDescription>
        </SelectContainer>
        
        <ButtonGroup>
          <PrimaryButton 
            onClick={handleCreateSession}
            disabled={isCreating || !teacherName.trim()}
          >
            {isCreating ? 'Creando...' : 'Crear Sesión'}
          </PrimaryButton>
        </ButtonGroup>
      </FormCard>

      <FormCard>
        <FormTitle>👥 Unirse (Equipo)</FormTitle>
        <FormDescription>
          Únete a una sesión existente usando el código proporcionado por el docente.
        </FormDescription>
        
        <Input
          label="Código de Sesión"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
          placeholder="Ingresa el código de 6 caracteres"
          maxLength={6}
        />
        
        <Input
          label="Nombre del Equipo"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Ingresa el nombre del equipo"
        />
        
        <ButtonGroup>
          <PrimaryButton 
            onClick={handleJoinTeam}
            disabled={isJoining || !sessionCode.trim() || !teamName.trim()}
          >
            {isJoining ? 'Uniéndose...' : 'Unirse al Juego'}
          </PrimaryButton>
        </ButtonGroup>
      </FormCard>
    </FormContainer>
  );
}

