import React, { useState } from 'react';
import styled from 'styled-components';

const ConfigContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const ConfigTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #495057;
  font-size: 18px;
  font-weight: 600;
`;

const TimerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const TimerItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TimerLabel = styled.label`
  font-weight: 600;
  color: #495057;
  font-size: 14px;
`;

const TimerInput = styled.input`
  padding: 8px 12px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TimerDisplay = styled.div`
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  color: #6c757d;
  text-align: center;
`;

const PresetButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const PresetButton = styled.button`
  background: ${props => props.active ? '#007bff' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: 1px solid #dee2e6;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }
`;

const TotalTime = styled.div`
  background: #e9ecef;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  color: #495057;
`;

export default function TimerConfig({ timers, onTimersChange, disabled }) {
  const [localTimers, setLocalTimers] = useState(timers);

  const handleTimerChange = (key, value) => {
    const newTimers = { ...localTimers, [key]: Math.max(0, parseInt(value) || 0) };
    setLocalTimers(newTimers);
    onTimersChange?.(newTimers);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const presets = {
    'Rápido': { m1: 300, m2: 300, m3: 300, final: 240 }, // 5, 5, 5, 4 min
    'Estándar': { m1: 600, m2: 600, m3: 600, final: 480 }, // 10, 10, 10, 8 min
    'Extendido': { m1: 900, m2: 900, m3: 900, final: 720 }, // 15, 15, 15, 12 min
    'Personalizado': null
  };

  const applyPreset = (presetName) => {
    if (presets[presetName]) {
      setLocalTimers(presets[presetName]);
      onTimersChange?.(presets[presetName]);
    }
  };

  const totalTime = Object.values(localTimers).reduce((sum, time) => sum + time, 0);

  return (
    <ConfigContainer>
      <ConfigTitle>⏱️ Configuración de Tiempos</ConfigTitle>
      
      <PresetButtons>
        {Object.keys(presets).map(presetName => (
          <PresetButton
            key={presetName}
            onClick={() => applyPreset(presetName)}
            disabled={disabled}
          >
            {presetName}
          </PresetButton>
        ))}
      </PresetButtons>

      <TimerGrid>
        <TimerItem>
          <TimerLabel>Misión 1 (Análisis Básico)</TimerLabel>
          <TimerInput
            type="number"
            value={localTimers.m1}
            onChange={(e) => handleTimerChange('m1', e.target.value)}
            disabled={disabled}
            min="0"
            step="60"
          />
          <TimerDisplay>{formatTime(localTimers.m1)}</TimerDisplay>
        </TimerItem>

        <TimerItem>
          <TimerLabel>Misión 2 (Formas de la Parábola)</TimerLabel>
          <TimerInput
            type="number"
            value={localTimers.m2}
            onChange={(e) => handleTimerChange('m2', e.target.value)}
            disabled={disabled}
            min="0"
            step="60"
          />
          <TimerDisplay>{formatTime(localTimers.m2)}</TimerDisplay>
        </TimerItem>

        <TimerItem>
          <TimerLabel>Misión 3 (Propiedades Avanzadas)</TimerLabel>
          <TimerInput
            type="number"
            value={localTimers.m3}
            onChange={(e) => handleTimerChange('m3', e.target.value)}
            disabled={disabled}
            min="0"
            step="60"
          />
          <TimerDisplay>{formatTime(localTimers.m3)}</TimerDisplay>
        </TimerItem>

        <TimerItem>
          <TimerLabel>Fase Final</TimerLabel>
          <TimerInput
            type="number"
            value={localTimers.final}
            onChange={(e) => handleTimerChange('final', e.target.value)}
            disabled={disabled}
            min="0"
            step="60"
          />
          <TimerDisplay>{formatTime(localTimers.final)}</TimerDisplay>
        </TimerItem>
      </TimerGrid>

      <TotalTime>
        ⏰ Tiempo Total: {formatTime(totalTime)} ({Math.floor(totalTime / 60)} minutos)
      </TotalTime>
    </ConfigContainer>
  );
}
