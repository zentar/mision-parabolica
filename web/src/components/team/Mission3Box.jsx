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

const GraphAnalysisSection = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 16px;
  font-weight: 600;
`;

export default function Mission3Box({ 
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
    roots: [0, 0],
    yIntercept: 0,
    concavity: 'up',
    range: [null, null],
    domain: [null, null],
    axisOfSymmetry: 0,
    maxMinValue: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitMission(teamId, missionKey, formData);
      setLastResult(result);
      onSubmit?.(result);
      
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


  const getStatusText = () => {
    if (status === 'completed') return 'Completada';
    if (status === 'available') return 'En progreso';
    if (status === 'time_expired') return 'Tiempo agotado';
    return 'Bloqueada';
  };

  return (
    <Card title={title} variant={status === 'completed' ? 'success' : 'info'}>
      <MissionContainer>
        <StatusBadge status={status}>
          {getStatusText()}
        </StatusBadge>
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

        {lastResult && !lastResult.ok && (
          <ErrorMessage>
            ❌ Respuesta incorrecta. Inténtalo de nuevo.
            {lastResult.error && ` (${lastResult.error})`}
          </ErrorMessage>
        )}
        {lastResult && lastResult.ok && (
          <SuccessMessage>
            🎉 ¡Misión completada correctamente! +{lastResult.pointsEarned || 0} puntos
          </SuccessMessage>
        )}


        <GraphAnalysisSection>
          <SectionTitle>📍 Puntos Clave de la Gráfica</SectionTitle>
          <FormGrid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Vértice (x, y)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  value={formData.vertex.x}
                  onChange={(e) => updateFormData('vertex', { ...formData.vertex, x: Number(e.target.value) })}
                  placeholder="x"
                  disabled={status === 'time_expired'}
                  style={{
                    width: '50%',
                    padding: '8px 12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease',
                    fontFamily: 'inherit',
                    backgroundColor: status === 'time_expired' ? '#f8f9fa' : 'white'
                  }}
                />
                <input
                  type="number"
                  value={formData.vertex.y}
                  onChange={(e) => updateFormData('vertex', { ...formData.vertex, y: Number(e.target.value) })}
                  placeholder="y"
                  disabled={status === 'time_expired'}
                  style={{
                    width: '50%',
                    padding: '8px 12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease',
                    fontFamily: 'inherit',
                    backgroundColor: status === 'time_expired' ? '#f8f9fa' : 'white'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Raíces (x₁, x₂)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  value={formData.roots[0]}
                  onChange={(e) => {
                    const newRoots = [...formData.roots];
                    newRoots[0] = Number(e.target.value);
                    updateFormData('roots', newRoots);
                  }}
                  placeholder="x₁"
                  disabled={status === 'time_expired'}
                  style={{
                    width: '50%',
                    padding: '8px 12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease',
                    fontFamily: 'inherit',
                    backgroundColor: status === 'time_expired' ? '#f8f9fa' : 'white'
                  }}
                />
                <input
                  type="number"
                  value={formData.roots[1]}
                  onChange={(e) => {
                    const newRoots = [...formData.roots];
                    newRoots[1] = Number(e.target.value);
                    updateFormData('roots', newRoots);
                  }}
                  placeholder="x₂"
                  disabled={status === 'time_expired'}
                  style={{
                    width: '50%',
                    padding: '8px 12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s ease',
                    fontFamily: 'inherit',
                    backgroundColor: status === 'time_expired' ? '#f8f9fa' : 'white'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Intersección con Y
              </label>
              <input
                type="number"
                value={formData.yIntercept}
                onChange={(e) => updateFormData('yIntercept', Number(e.target.value))}
                placeholder="y"
                disabled={status === 'time_expired'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                  backgroundColor: status === 'time_expired' ? '#f8f9fa' : 'white'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Concavidad
              </label>
              <select
                value={formData.concavity}
                onChange={(e) => updateFormData('concavity', e.target.value)}
                disabled={status === 'time_expired'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                  backgroundColor: status === 'time_expired' ? '#f8f9fa' : 'white'
                }}
              >
                <option value="up">Hacia arriba</option>
                <option value="down">Hacia abajo</option>
              </select>
            </div>
          </FormGrid>
        </GraphAnalysisSection>

        <GraphAnalysisSection>
          <SectionTitle>📊 Análisis de Comportamiento</SectionTitle>
          <FormGrid>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Eje de Simetría
              </label>
              <input
                type="number"
                value={formData.axisOfSymmetry}
                onChange={(e) => updateFormData('axisOfSymmetry', Number(e.target.value))}
                placeholder="x = ?"
                disabled={status === 'time_expired'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                  backgroundColor: status === 'time_expired' ? '#f8f9fa' : 'white'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Valor Máximo/Mínimo
              </label>
              <input
                type="number"
                value={formData.maxMinValue}
                onChange={(e) => updateFormData('maxMinValue', Number(e.target.value))}
                placeholder="y = ?"
                disabled={status === 'time_expired'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                  backgroundColor: status === 'time_expired' ? '#f8f9fa' : 'white'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Rango Inferior
              </label>
              <input
                type="text"
                value={formData.range[0] || ''}
                onChange={(e) => {
                  const newRange = [...formData.range];
                  newRange[0] = e.target.value;
                  updateFormData('range', newRange);
                }}
                placeholder="Ej: -∞, -inf, -infinito, o un número"
                disabled={status === 'time_expired'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                  backgroundColor: status === 'time_expired' ? '#f8f9fa' : 'white'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Rango Superior
              </label>
              <input
                type="text"
                value={formData.range[1] || ''}
                onChange={(e) => {
                  const newRange = [...formData.range];
                  newRange[1] = e.target.value;
                  updateFormData('range', newRange);
                }}
                placeholder="Ej: ∞, inf, infinito, o un número"
                disabled={status === 'time_expired'}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                  backgroundColor: status === 'time_expired' ? '#f8f9fa' : 'white'
                }}
              />
            </div>
          </FormGrid>
        </GraphAnalysisSection>
        
        <ButtonGroup>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || status === 'time_expired'}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
          </Button>
        </ButtonGroup>

      </MissionContainer>
    </Card>
  );
}
