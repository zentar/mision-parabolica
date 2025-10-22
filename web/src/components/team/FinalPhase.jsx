import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';
import { submitFinal } from '../../state/store';

const FinalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #495057;
  font-size: 14px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  border-color: #2E7D32;
  
  &:hover {
    background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(46, 125, 50, 0.4);
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
  color: #1B5E20;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  border: 2px solid #4CAF50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
  color: #B71C1C;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  border: 2px solid #F44336;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
`;

export default function FinalPhase({ teamId, teamProgress, sessionData }) {
  const [equation, setEquation] = useState('');
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitFinal(teamId, { 
        equation, 
        justification 
      });
      
      setLastResult(result);
    } catch (error) {
      console.error('Error submitting final:', error);
      setLastResult({ ok: false, error: 'Error al enviar la respuesta' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Fase Final — El Rescate" variant="success">
      <FinalContainer>
        <div style={{ 
          background: '#fff3cd', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '16px',
          border: '2px solid #ffc107'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#856404', fontSize: '18px' }}>🎯 Objetivo Final:</h4>
          <p style={{ margin: '0', color: '#856404', fontSize: '16px' }}>
            Con las pistas obtenidas de las misiones anteriores, cada equipo debe deducir y formar la ecuación final que resuelve el misterio.
          </p>
        </div>

        {/* Mostrar pistas solo si se completaron las misiones correspondientes */}
        {(teamProgress?.m1?.isCorrect || teamProgress?.m2?.isCorrect || teamProgress?.m3?.isCorrect) && (
          <div style={{ 
            background: '#d1ecf1', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            border: '1px solid #bee5eb'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#0c5460' }}>💡 Pistas Obtenidas:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {teamProgress?.m1?.isCorrect && sessionData?.missions?.find(m => m.key === 'm1')?.hints && (
                <div style={{ 
                  background: 'white', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  border: '1px solid #bee5eb'
                }}>
                  <strong>🔍 Pista 1 (Misión 1):</strong> {sessionData.missions.find(m => m.key === 'm1').hints[0]}
                </div>
              )}
              {teamProgress?.m2?.isCorrect && sessionData?.missions?.find(m => m.key === 'm2')?.hints && (
                <div style={{ 
                  background: 'white', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  border: '1px solid #bee5eb'
                }}>
                  <strong>📍 Pista 2 (Misión 2):</strong> {sessionData.missions.find(m => m.key === 'm2').hints[0]}
                </div>
              )}
              {teamProgress?.m3?.isCorrect && sessionData?.missions?.find(m => m.key === 'm3')?.hints && (
                <div style={{ 
                  background: 'white', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  border: '1px solid #bee5eb'
                }}>
                  <strong>🎯 Pista 3 (Misión 3):</strong> {sessionData.missions.find(m => m.key === 'm3').hints[0]}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mostrar mensaje si no se han completado misiones */}
        {!teamProgress?.m1?.isCorrect && !teamProgress?.m2?.isCorrect && !teamProgress?.m3?.isCorrect && (
          <div style={{ 
            background: '#fff3cd', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            border: '1px solid #ffc107'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#856404' }}>⚠️ Sin Pistas Disponibles</h4>
            <p style={{ margin: '0', color: '#856404', fontSize: '14px' }}>
              Para obtener pistas, debes completar al menos una de las misiones anteriores.
            </p>
          </div>
        )}
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '16px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>📝 Tu Respuesta:</h4>
          
          <FormGroup>
            <Label>Ecuación Final</Label>
            <StyledInput
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="Ingresa la ecuación final"
            />
            <small style={{ color: '#6c757d', fontSize: '12px' }}>
              Usa las pistas para deducir la ecuación correcta
            </small>
          </FormGroup>
          
          <FormGroup>
            <Label>Justificación Matemática (Opcional)</Label>
            <StyledTextarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explica cómo usaste las pistas para llegar a la respuesta... (opcional)"
            />
            <small style={{ color: '#6c757d', fontSize: '12px' }}>
              Describe tu proceso de razonamiento usando las pistas obtenidas (opcional)
            </small>
          </FormGroup>
        </div>
        
        <ButtonContainer>
          <SubmitButton 
            onClick={handleSubmit}
            disabled={isSubmitting || !equation.trim()}
          >
            {isSubmitting ? 'Enviando...' : '🚀 Enviar Respuesta Final'}
          </SubmitButton>
          {!equation.trim() && (
            <small style={{ color: '#dc3545', fontSize: '12px', marginTop: '8px' }}>
              Ingresa una ecuación para continuar
            </small>
          )}
        </ButtonContainer>
      </FinalContainer>
    </Card>
  );
}


