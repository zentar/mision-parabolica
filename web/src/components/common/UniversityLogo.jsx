import React from 'react';
import styled from 'styled-components';
import logoImage from '../../assets/logo.png';

const UniversityLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  padding: 10px;
`;

const UniversityEmblem = styled.img`
  max-width: 300px;
  height: auto;
  object-fit: contain;
`;

export default function UniversityLogo() {
  return (
    <UniversityLogoContainer>
      <UniversityEmblem src={logoImage} alt="Universidad Católica de Santiago de Guayaquil" />
    </UniversityLogoContainer>
  );
}