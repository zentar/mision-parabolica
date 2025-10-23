import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
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
  text-align: center;
`;

const Subtitle = styled.p`
  color: #EDECE3;
  font-family: 'Poppins', sans-serif;
  font-size: 1.4rem;
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.01em;
  text-align: center;
`;

export default function Logo({ showSubtitle = true, compact = false }) {
  return (
    <LogoContainer>
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
