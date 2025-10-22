import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${props => props.variant === 'primary' ? 'linear-gradient(135deg, #722F37 0%, #5D1A1A 100%)' : 'linear-gradient(135deg, #303132 0%, #303132 100%)'};
  color: #FFFFFF;
  border: 2px solid ${props => props.variant === 'primary' ? '#722F37' : '#303132'};
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(114, 47, 55, 0.4);
  letter-spacing: 0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  
  &:hover {
    background: ${props => props.variant === 'primary' ? 'linear-gradient(135deg, #5D1A1A 0%, #722F37 100%)' : 'linear-gradient(135deg, #303132 0%, #303132 100%)'};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(114, 47, 55, 0.6);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(48, 49, 50, 0.3);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #EDECE3 0%, #EDECE3 100%);
    border-color: #EDECE3;
    color: #303132;
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
    text-shadow: none;
  }
  
  ${props => props.size === 'large' && `
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 700;
  `}
  
  ${props => props.size === 'small' && `
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 500;
  `}
`;

export default function Button({ children, variant = 'primary', size = 'medium', ...props }) {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
}


