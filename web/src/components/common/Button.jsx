import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${props => props.variant === 'primary' ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#0056b3' : '#545b62'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  ${props => props.size === 'large' && `
    padding: 12px 24px;
    font-size: 16px;
  `}
  
  ${props => props.size === 'small' && `
    padding: 6px 12px;
    font-size: 12px;
  `}
`;

export default function Button({ children, variant = 'primary', size = 'medium', ...props }) {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
}


