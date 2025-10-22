import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #EDECE3;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 400;
  background: #F2F2F2;
  color: #303132;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #A90046;
    box-shadow: 0 0 0 4px rgba(169, 0, 70, 0.15);
    background: #F2F2F2;
  }
  
  &:invalid {
    border-color: #A90046;
    box-shadow: 0 0 0 4px rgba(169, 0, 70, 0.15);
  }
  
  &::placeholder {
    color: #303132;
    opacity: 0.6;
    font-weight: 300;
  }
  
  &:disabled {
    background: #EDECE3;
    color: #303132;
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  color: #303132;
  font-size: 14px;
  letter-spacing: 0.01em;
`;

const ErrorMessage = styled.span`
  color: #A90046;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
`;

export default function Input({ 
  label, 
  error, 
  ...props 
}) {
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <StyledInput {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
}


