import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
`;

const LogoIcon = styled.svg`
  width: ${props => props.size || '120px'};
  height: ${props => props.size || '120px'};
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const Title = styled.h1`
  color: #F2F2F2;
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => props.compact ? '2.5rem' : '3.5rem'};
  font-weight: 800;
  margin: 0;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Subtitle = styled.p`
  color: #EDECE3;
  font-family: 'Poppins', sans-serif;
  font-size: 1.4rem;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.01em;
`;

export default function Logo({ showSubtitle = true, compact = false }) {
  return (
    <LogoContainer>
      <LogoIcon size={compact ? '80px' : '120px'} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Logo limpio sin elementos decorativos */}
      </LogoIcon>
      
      <LogoText>
        <Title compact={compact}>
          🚀 Misión Parabólica
        </Title>
        {showSubtitle && (
          <Subtitle>Explora las propiedades de las parábolas en una aventura matemática</Subtitle>
        )}
      </LogoText>
    </LogoContainer>
  );
}
