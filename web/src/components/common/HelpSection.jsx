import React, { useState } from 'react';
import styled from 'styled-components';
import Card from './Card';
import Button from './Button';

const HelpContainer = styled.div`
  margin: 40px 0;
`;

const HelpHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const HelpTitle = styled.h2`
  color: #F2F2F2;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
`;

const HelpSubtitle = styled.p`
  color: #EDECE3;
  font-size: 1.2rem;
  font-weight: 300;
  opacity: 0.9;
`;

const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
`;

const HelpCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(169, 0, 70, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(169, 0, 70, 0.2);
    border-color: rgba(169, 0, 70, 0.4);
  }
`;

const CardTitle = styled.h3`
  color: #A90046;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardContent = styled.div`
  color: #495057;
  line-height: 1.6;
`;

const StepList = styled.ol`
  margin: 0;
  padding-left: 20px;
  
  li {
    margin-bottom: 8px;
    color: #495057;
  }
`;

const FeatureList = styled.ul`
  margin: 0;
  padding-left: 20px;
  
  li {
    margin-bottom: 8px;
    color: #495057;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const LevelInfo = styled.div`
  background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
  border: 2px solid #4CAF50;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
`;

const LevelTitle = styled.h4`
  color: #1B5E20;
  font-weight: 600;
  margin-bottom: 8px;
`;

const LevelDescription = styled.p`
  color: #2E7D32;
  font-size: 0.9rem;
  margin: 0;
`;

const ToggleButton = styled(Button)`
  margin: 0 auto;
  display: block;
  background: linear-gradient(135deg, #A90046 0%, #8B0038 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(169, 0, 70, 0.3);
  }
`;

const ExpandedContent = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #E9ECEF;
`;

export default function HelpSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <HelpContainer>
      <HelpHeader>
        <HelpTitle>📚 Guía de Uso</HelpTitle>
        <HelpSubtitle>Aprende cómo usar Misión Parabólica paso a paso</HelpSubtitle>
      </HelpHeader>

      <HelpGrid>
        <HelpCard>
          <CardTitle>👨‍🏫 Para Docentes</CardTitle>
          <CardContent>
            <StepList>
              <li>Ingresa tu nombre en el campo correspondiente</li>
              <li>Selecciona el nivel de dificultad (Básico, Intermedio, Avanzado)</li>
              <li>Haz clic en "Crear Sesión" para generar un código</li>
              <li>Comparte el código con tus estudiantes</li>
              <li>Inicia la sesión cuando todos estén listos</li>
              <li>Monitorea el progreso en tiempo real</li>
            </StepList>
          </CardContent>
        </HelpCard>

        <HelpCard>
          <CardTitle>👥 Para Estudiantes</CardTitle>
          <CardContent>
            <StepList>
              <li>Ingresa el código de sesión proporcionado por tu docente</li>
              <li>Escribe el nombre de tu equipo</li>
              <li>Haz clic en "Unirse a Sesión"</li>
              <li>Completa las 3 misiones en orden</li>
              <li>Usa las pistas de las misiones completadas en la fase final</li>
              <li>Resuelve la ecuación final para completar la misión</li>
            </StepList>
          </CardContent>
        </HelpCard>

        <HelpCard>
          <CardTitle>🎯 Niveles de Dificultad</CardTitle>
          <CardContent>
            <LevelInfo>
              <LevelTitle>🟢 Básico</LevelTitle>
              <LevelDescription>Ecuaciones simples para principiantes. Pistas directas en la fase final.</LevelDescription>
            </LevelInfo>
            
            <LevelInfo>
              <LevelTitle>🟡 Intermedio</LevelTitle>
              <LevelDescription>Ecuaciones de dificultad media. Pistas guiadas que requieren reflexión.</LevelDescription>
            </LevelInfo>
            
            <LevelInfo>
              <LevelTitle>🔴 Avanzado</LevelTitle>
              <LevelDescription>Ecuaciones complejas para estudiantes avanzados. Pistas desafiantes.</LevelDescription>
            </LevelInfo>
          </CardContent>
        </HelpCard>

        <HelpCard>
          <CardTitle>⭐ Características</CardTitle>
          <CardContent>
            <FeatureList>
              <li>✅ Sistema de puntuación con bonificaciones por tiempo</li>
              <li>✅ Pistas dinámicas según el nivel seleccionado</li>
              <li>✅ Ecuaciones parametrizadas por dificultad</li>
              <li>✅ Monitoreo en tiempo real para docentes</li>
              <li>✅ Interfaz intuitiva y moderna</li>
              <li>✅ Sistema de notificaciones</li>
            </FeatureList>
          </CardContent>
        </HelpCard>
      </HelpGrid>

      <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Ocultar Detalles' : 'Ver Más Detalles'}
      </ToggleButton>

      {isExpanded && (
        <ExpandedContent>
          <HelpGrid>
            <HelpCard>
              <CardTitle>🎮 Cómo Jugar</CardTitle>
              <CardContent>
                <p><strong>Misión 1:</strong> Analiza la parábola y encuentra sus propiedades fundamentales (vértice, raíces, concavidad, etc.)</p>
                <p><strong>Misión 2:</strong> Determina la forma factorizada y la forma canónica (vértice) de la parábola</p>
                <p><strong>Misión 3:</strong> Identifica los puntos clave de la gráfica y su comportamiento</p>
                <p><strong>Fase Final:</strong> Usa las pistas obtenidas de las misiones anteriores para resolver la ecuación final</p>
              </CardContent>
            </HelpCard>

            <HelpCard>
              <CardTitle>🏆 Sistema de Puntuación</CardTitle>
              <CardContent>
                <p><strong>Puntos Base:</strong> 10 puntos por cada misión completada</p>
                <p><strong>Bonificación por Tiempo:</strong> 1 punto adicional por cada 30 segundos restantes</p>
                <p><strong>Penalización por Pistas:</strong> Se descuentan puntos por usar pistas (configurable)</p>
                <p><strong>Ejemplo:</strong> Si completas una misión en 5 minutos de 10 minutos disponibles, obtienes 10 + 10 = 20 puntos</p>
              </CardContent>
            </HelpCard>

            <HelpCard>
              <CardTitle>💡 Consejos</CardTitle>
              <CardContent>
                <FeatureList>
                  <li>🎯 Lee cuidadosamente cada enunciado</li>
                  <li>⏱️ Gestiona tu tiempo eficientemente</li>
                  <li>🔍 Usa las pistas estratégicamente</li>
                  <li>📝 Verifica tus respuestas antes de enviar</li>
                  <li>👥 Colabora con tu equipo</li>
                  <li>🧮 Recuerda las fórmulas de parábolas</li>
                </FeatureList>
              </CardContent>
            </HelpCard>

            <HelpCard>
              <CardTitle>🆘 Solución de Problemas</CardTitle>
              <CardContent>
                <p><strong>No puedo unirme a la sesión:</strong> Verifica que el código sea correcto y que la sesión esté activa</p>
                <p><strong>La sesión no inicia:</strong> Asegúrate de que todos los equipos estén conectados</p>
                <p><strong>Problemas de conexión:</strong> Recarga la página y vuelve a intentar</p>
                <p><strong>Respuesta incorrecta:</strong> Verifica el formato de tu respuesta (decimales, fracciones, etc.)</p>
              </CardContent>
            </HelpCard>
          </HelpGrid>
        </ExpandedContent>
      )}
    </HelpContainer>
  );
}
