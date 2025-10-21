import styled from 'styled-components';

const StyledCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props.variant === 'success' && `
    border-color: #28a745;
    background: #f8fff9;
  `}
  
  ${props => props.variant === 'warning' && `
    border-color: #ffc107;
    background: #fffdf7;
  `}
  
  ${props => props.variant === 'danger' && `
    border-color: #dc3545;
    background: #fff8f8;
  `}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #495057;
`;

const CardBody = styled.div`
  color: #6c757d;
  line-height: 1.5;
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


