import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';
import { submitMission } from '../../state/store';

const MissionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MissionDescription = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin: 0 0 20px 0;
  font-size: 16px;
  line-height: 1.6;
  color: #495057;
`;

const FormulaHighlight = styled.span`
  background: #dc3545;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 20px;
  font-weight: bold;
  display: inline-block;
  margin: 8px 0;
  font-family: 'Courier New', monospace;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  background: ${props => {
    if (props.status === 'completed') return 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)';
    if (props.status === 'available') return 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)';
    if (props.status === 'time_expired') return 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)';
    return 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)';
  }};
  color: ${props => {
    if (props.status === 'completed') return '#1B5E20';
    if (props.status === 'available') return '#0D47A1';
    if (props.status === 'time_expired') return '#E65100';
    return '#B71C1C';
  }};
  border: 2px solid ${props => {
    if (props.status === 'completed') return '#4CAF50';
    if (props.status === 'available') return '#2196F3';
    if (props.status === 'time_expired') return '#FF9800';
    return '#F44336';
  }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 16px;
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
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  font-family: 'Courier New', monospace;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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

export default function Mission2Box({ 
  title, 
  missionKey, 
  teamId, 
  description,
  status = 'available',
  onSubmit,
  onHint 
}) {
  const [formData, setFormData] = useState({
    factoredForm: '',
    canonicalForm: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitMission(teamId, missionKey, formData);
      setLastResult(result);
      onSubmit?.(result);
      
      if (result.ok) {
        console.log('🎉 ¡Misión 2 completada!');
      }
    } catch (error) {
      console.error('Error submitting mission:', error);
      setLastResult({ ok: false, error: 'Error al enviar la respuesta' });
    } finally {
      setIsSubmitting(false);
    }
  };


  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <MissionContainer>
      <Card title={title} variant="primary">
        <MissionDescription>
          {(() => {
            // Extraer la fórmula del enunciado
            const formulaMatch = description.match(/f\(x\)\s*=\s*[^.]*/);
            if (formulaMatch) {
              const formula = formulaMatch[0];
              const beforeFormula = description.substring(0, description.indexOf(formula));
              const afterFormula = description.substring(description.indexOf(formula) + formula.length);
              return (
                <>
                  {beforeFormula}
                  <FormulaHighlight>{formula}</FormulaHighlight>
                  {afterFormula}
                </>
              );
            }
            return description;
          })()}
        </MissionDescription>
        
        <StatusBadge status={status}>
          {status === 'completed' && '✅ Completada'}
          {status === 'available' && '🔄 En progreso'}
          {status === 'time_expired' && '⏰ Tiempo agotado'}
          {status === 'locked' && '🔒 Bloqueada'}
        </StatusBadge>

        {lastResult && lastResult.ok && (
          <SuccessMessage>
            ✅ ¡Misión completada correctamente! +{lastResult.pointsEarned || 0} puntos
          </SuccessMessage>
        )}

        {lastResult && !lastResult.ok && (
          <ErrorMessage>
            ❌ Respuesta incorrecta. Inténtalo de nuevo.
          </ErrorMessage>
        )}


        <FormGrid>
          <FormGroup>
            <Label>Forma Factorizada</Label>
            <StyledInput
              type="text"
              value={formData.factoredForm}
              onChange={(e) => updateFormData('factoredForm', e.target.value)}
              placeholder="Ej: (x-1)(x-5)"
              disabled={status === 'time_expired'}
            />
            <small style={{ color: '#6c757d', fontSize: '12px' }}>
              Escribe la forma factorizada de la función
            </small>
          </FormGroup>

          <FormGroup>
            <Label>Forma Canónica (Vértice)</Label>
            <StyledInput
              type="text"
              value={formData.canonicalForm}
              onChange={(e) => updateFormData('canonicalForm', e.target.value)}
              placeholder="Ej: (x-2)^2+3"
              disabled={status === 'time_expired'}
            />
            <small style={{ color: '#6c757d', fontSize: '12px' }}>
              Escribe la forma canónica (vértice) de la función
            </small>
          </FormGroup>
        </FormGrid>
        
        <ButtonGroup>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || status === 'time_expired'}
            variant="primary"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
          </Button>
          
        </ButtonGroup>
      </Card>
    </MissionContainer>
  );
}
