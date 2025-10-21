import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { submitMission, askHint } from '../../state/store';

const MissionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MissionDescription = styled.p`
  color: #6c757d;
  font-size: 14px;
  margin: 0 0 16px 0;
  line-height: 1.5;
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
    if (props.status === 'completed') return '#d4edda';
    if (props.status === 'available') return '#d1ecf1';
    if (props.status === 'time_expired') return '#fff3cd';
    return '#f8d7da';
  }};
  color: ${props => {
    if (props.status === 'completed') return '#155724';
    if (props.status === 'available') return '#0c5460';
    if (props.status === 'time_expired') return '#856404';
    return '#721c24';
  }};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const HintButton = styled(Button)`
  background: #ffc107;
  color: #212529;
  
  &:hover {
    background: #e0a800;
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

export default function MissionBox({ 
  title, 
  missionKey, 
  teamId, 
  description,
  status = 'available',
  onSubmit,
  onHint 
}) {
  const [formData, setFormData] = useState({
    vertex: { x: 0, y: 0 },
    yIntercept: 0,
    roots: [0, 0],
    concavity: 'down',
    axis: 0,
    range: [null, null]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingHint, setIsRequestingHint] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [hintCount, setHintCount] = useState(0);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitMission(teamId, missionKey, formData);
      setLastResult(result);
      onSubmit?.(result);
      
      // Si la misión es correcta, mostrar mensaje de éxito
      if (result.ok) {
        console.log('🎉 ¡Misión completada!');
      }
    } catch (error) {
      console.error('Error submitting mission:', error);
      setLastResult({ ok: false, error: 'Error al enviar la respuesta' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHint = async () => {
    setIsRequestingHint(true);
    try {
      const result = await askHint(teamId, missionKey);
      onHint?.(result);
    } catch (error) {
      console.error('Error requesting hint:', error);
    } finally {
      setIsRequestingHint(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = (field, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value
      }
    }));
  };

  return (
    <Card title={title}>
      <MissionContainer>
        <MissionDescription>{description}</MissionDescription>
        
        {/* Status Badge */}
        <StatusBadge status={status}>
          {status === 'completed' && '✅ Completado'}
          {status === 'available' && '⏳ En progreso'}
          {status === 'time_expired' && '⏰ Tiempo agotado'}
          {status === 'locked' && '🔒 Bloqueado'}
        </StatusBadge>
        
        {/* Success/Error Messages */}
        {lastResult && (
          <>
            {lastResult.ok ? (
              <SuccessMessage>
                🎉 ¡Misión completada correctamente! +{lastResult.score || 0} puntos
              </SuccessMessage>
            ) : (
              <ErrorMessage>
                ❌ Respuesta incorrecta. Inténtalo de nuevo.
              </ErrorMessage>
            )}
          </>
        )}
        
        <FormGrid>
          <Input
            label="Vértice X"
            type="number"
            step="any"
            value={formData.vertex.x}
            onChange={(e) => updateNestedFormData('vertex', 'x', Number(e.target.value))}
            disabled={status === 'time_expired'}
          />
          
          <Input
            label="Vértice Y"
            type="number"
            step="any"
            value={formData.vertex.y}
            onChange={(e) => updateNestedFormData('vertex', 'y', Number(e.target.value))}
            disabled={status === 'time_expired'}
          />
          
          <Input
            label="Corte con Y"
            type="number"
            step="any"
            value={formData.yIntercept}
            onChange={(e) => updateFormData('yIntercept', Number(e.target.value))}
            disabled={status === 'time_expired'}
          />
          
          <Input
            label="Raíz 1"
            type="number"
            step="any"
            value={formData.roots[0]}
            onChange={(e) => {
              const newRoots = [...formData.roots];
              newRoots[0] = Number(e.target.value);
              updateFormData('roots', newRoots);
            }}
            disabled={status === 'time_expired'}
          />
          
          <Input
            label="Raíz 2"
            type="number"
            step="any"
            value={formData.roots[1]}
            onChange={(e) => {
              const newRoots = [...formData.roots];
              newRoots[1] = Number(e.target.value);
              updateFormData('roots', newRoots);
            }}
            disabled={status === 'time_expired'}
          />
          
          <div>
            <label>
              Concavidad
              <select 
                value={formData.concavity} 
                onChange={(e) => updateFormData('concavity', e.target.value)}
                disabled={status === 'time_expired'}
                style={{ width: '100%', padding: '8px 12px', border: '2px solid #e9ecef', borderRadius: '6px' }}
              >
                <option value="up">Arriba</option>
                <option value="down">Abajo</option>
              </select>
            </label>
          </div>
          
          <Input
            label="Eje de Simetría"
            type="number"
            step="any"
            value={formData.axis}
            onChange={(e) => updateFormData('axis', Number(e.target.value))}
            disabled={status === 'time_expired'}
          />
          
          <Input
            label="Rango Inferior"
            type="number"
            step="any"
            value={formData.range[0] || ''}
            onChange={(e) => {
              const newRange = [...formData.range];
              newRange[0] = e.target.value === '' ? null : Number(e.target.value);
              updateFormData('range', newRange);
            }}
            disabled={status === 'time_expired'}
          />
          
          <Input
            label="Rango Superior"
            type="number"
            step="any"
            value={formData.range[1] || ''}
            onChange={(e) => {
              const newRange = [...formData.range];
              newRange[1] = e.target.value === '' ? null : Number(e.target.value);
              updateFormData('range', newRange);
            }}
            disabled={status === 'time_expired'}
          />
        </FormGrid>
        
        <ButtonGroup>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || status === 'time_expired'}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
          </Button>
          
          <HintButton 
            onClick={handleHint}
            disabled={isRequestingHint || status === 'time_expired'}
          >
            {isRequestingHint ? 'Solicitando...' : '💡 Pedir Pista'}
          </HintButton>
        </ButtonGroup>
      </MissionContainer>
    </Card>
  );
}

