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

export default function MissionBox({ 
  title, 
  missionKey, 
  teamId, 
  description,
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitMission(teamId, missionKey, formData);
      onSubmit?.(result);
    } catch (error) {
      console.error('Error submitting mission:', error);
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
        
        <FormGrid>
          <Input
            label="Vértice X"
            type="number"
            step="any"
            value={formData.vertex.x}
            onChange={(e) => updateNestedFormData('vertex', 'x', Number(e.target.value))}
          />
          
          <Input
            label="Vértice Y"
            type="number"
            step="any"
            value={formData.vertex.y}
            onChange={(e) => updateNestedFormData('vertex', 'y', Number(e.target.value))}
          />
          
          <Input
            label="Corte con Y"
            type="number"
            step="any"
            value={formData.yIntercept}
            onChange={(e) => updateFormData('yIntercept', Number(e.target.value))}
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
          />
          
          <div>
            <label>
              Concavidad
              <select 
                value={formData.concavity} 
                onChange={(e) => updateFormData('concavity', e.target.value)}
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
          />
        </FormGrid>
        
        <ButtonGroup>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
          </Button>
          
          <HintButton 
            onClick={handleHint}
            disabled={isRequestingHint}
          >
            {isRequestingHint ? 'Solicitando...' : '💡 Pedir Pista'}
          </HintButton>
        </ButtonGroup>
      </MissionContainer>
    </Card>
  );
}


