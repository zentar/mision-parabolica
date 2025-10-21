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
  background: #28a745;
  
  &:hover {
    background: #218838;
  }
`;

export default function FinalPhase({ teamId }) {
  const [equation, setEquation] = useState('(x-2)^2=0');
  const [justification, setJustification] = useState('Trinomio cuadrado perfecto, raíz doble.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitFinal(teamId, { 
        equation, 
        justification 
      });
      console.log('Final submission result:', result);
    } catch (error) {
      console.error('Error submitting final:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Fase Final" variant="success">
      <FinalContainer>
        <FormGroup>
          <Label>Ecuación de la Parábola</Label>
          <StyledInput
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            placeholder="Ingresa la ecuación (ej: (x-2)^2=0)"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Justificación</Label>
          <StyledTextarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Explica tu razonamiento matemático..."
          />
        </FormGroup>
        
        <ButtonContainer>
          <SubmitButton 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : '🚀 Enviar Respuesta Final'}
          </SubmitButton>
        </ButtonContainer>
      </FinalContainer>
    </Card>
  );
}


