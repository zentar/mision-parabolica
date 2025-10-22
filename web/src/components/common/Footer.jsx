import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: rgba(48, 49, 50, 0.95);
  backdrop-filter: blur(20px);
  padding: 20px 0;
  text-align: center;
  border-top: 2px solid #A90046;
  margin-top: 40px;
`;

const FooterContent = styled.div`
  color: #F2F2F2;
  font-size: 14px;
  font-weight: 400;
  opacity: 0.8;
`;

const DeveloperCredit = styled.span`
  color: #A90046;
  font-weight: 600;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        Desarrollado por <DeveloperCredit>Zentar</DeveloperCredit>
      </FooterContent>
    </FooterContainer>
  );
}
