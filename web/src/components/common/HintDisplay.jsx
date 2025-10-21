import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HintContainer = styled.div`
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 2px solid #ffc107;
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
  animation: ${fadeIn} 0.3s ease-out;
`;

const HintHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const HintIcon = styled.div`
  font-size: 24px;
  color: #856404;
`;

const HintTitle = styled.h4`
  margin: 0;
  color: #856404;
  font-size: 16px;
  font-weight: 600;
`;

const HintContent = styled.div`
  color: #856404;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
`;

const HintCounter = styled.div`
  background: #856404;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
`;

const HintList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HintItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  border-left: 4px solid #ffc107;
`;

const HintNumber = styled.div`
  background: #856404;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
`;

const HintText = styled.div`
  color: #856404;
  font-size: 13px;
  line-height: 1.4;
  flex: 1;
`;

export default function HintDisplay({ 
  hints = [], 
  currentHintIndex = 0, 
  maxHints = 3,
  onClose 
}) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible || hints.length === 0) return null;

  const displayedHints = hints.slice(0, currentHintIndex + 1);

  return (
    <HintContainer>
      <HintHeader>
        <HintIcon>💡</HintIcon>
        <HintTitle>Pistas Reveladas</HintTitle>
        <HintCounter>{currentHintIndex + 1}/{maxHints}</HintCounter>
        <button 
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            color: '#856404',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          ×
        </button>
      </HintHeader>
      
      <HintList>
        {displayedHints.map((hint, index) => (
          <HintItem key={index}>
            <HintNumber>{index + 1}</HintNumber>
            <HintText>{hint}</HintText>
          </HintItem>
        ))}
      </HintList>
    </HintContainer>
  );
}
