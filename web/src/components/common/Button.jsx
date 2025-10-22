import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${props => {
    if (props.variant === 'primary') return 'linear-gradient(135deg, #A90046 0%, #8B0038 100%)';
    if (props.variant === 'success') return 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)';
    if (props.variant === 'warning') return 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)';
    if (props.variant === 'danger') return 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)';
    if (props.variant === 'info') return 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)';
    return 'linear-gradient(135deg, #303132 0%, #1A1A1A 100%)';
  }};
  color: #FFFFFF;
  border: 2px solid ${props => {
    if (props.variant === 'primary') return '#A90046';
    if (props.variant === 'success') return '#2E7D32';
    if (props.variant === 'warning') return '#F57C00';
    if (props.variant === 'danger') return '#D32F2F';
    if (props.variant === 'info') return '#1976D2';
    return '#303132';
  }};
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.01em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: ${props => {
      if (props.variant === 'primary') return 'linear-gradient(135deg, #8B0038 0%, #A90046 100%)';
      if (props.variant === 'success') return 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)';
      if (props.variant === 'warning') return 'linear-gradient(135deg, #E65100 0%, #F57C00 100%)';
      if (props.variant === 'danger') return 'linear-gradient(135deg, #B71C1C 0%, #D32F2F 100%)';
      if (props.variant === 'info') return 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)';
      return 'linear-gradient(135deg, #1A1A1A 0%, #303132 100%)';
    }};
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #BDBDBD 0%, #9E9E9E 100%);
    border-color: #BDBDBD;
    color: #757575;
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-shadow: none;
    
    &::before {
      display: none;
    }
  }
  
  ${props => props.size === 'large' && `
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 16px;
  `}
  
  ${props => props.size === 'small' && `
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 8px;
  `}
`;

export default function Button({ children, variant = 'primary', size = 'medium', ...props }) {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
}


