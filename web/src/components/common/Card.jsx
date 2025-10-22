import styled from 'styled-components';

const StyledCard = styled.div`
  background: #F2F2F2;
  border: 2px solid #EDECE3;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(48, 49, 50, 0.15);
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  
  &:hover {
    box-shadow: 0 12px 32px rgba(48, 49, 50, 0.25);
    transform: translateY(-2px);
  }
  
  ${props => props.variant === 'success' && `
    border-color: #A90046;
    background: linear-gradient(135deg, #F2F2F2 0%, #EDECE3 100%);
    box-shadow: 0 8px 24px rgba(169, 0, 70, 0.2);
  `}
  
  ${props => props.variant === 'warning' && `
    border-color: #90046;
    background: linear-gradient(135deg, #F2F2F2 0%, #EDECE3 100%);
    box-shadow: 0 8px 24px rgba(144, 0, 70, 0.2);
  `}
  
  ${props => props.variant === 'danger' && `
    border-color: #A90046;
    background: linear-gradient(135deg, #F2F2F2 0%, #EDECE3 100%);
    box-shadow: 0 8px 24px rgba(169, 0, 70, 0.2);
  `}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #EDECE3;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #303132;
  letter-spacing: -0.01em;
`;

const CardBody = styled.div`
  color: #303132;
  line-height: 1.6;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
`;

export default function Card({ 
  title, 
  children, 
  variant = 'default',
  header,
  ...props 
}) {
  return (
    <StyledCard variant={variant} {...props}>
      {(title || header) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {header}
        </CardHeader>
      )}
      <CardBody>{children}</CardBody>
    </StyledCard>
  );
}


