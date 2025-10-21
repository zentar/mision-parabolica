import styled from 'styled-components';

const TimerContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TimerItem = styled.div`
  background: ${props => {
    if (props.time <= 0) return '#dc3545';
    if (props.time <= 60) return '#ffc107';
    return '#28a745';
  }};
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  min-width: 80px;
  text-align: center;
  transition: all 0.3s ease;
  
  ${props => props.time <= 0 && `
    animation: pulse 1s infinite;
  `}
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const TimerLabel = styled.div`
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 2px;
`;

const TimerValue = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const formatTime = (seconds) => {
  if (seconds <= 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function TimerPanel({ timers }) {
  return (
    <TimerContainer>
      {Object.entries(timers).map(([key, time]) => (
        <TimerItem key={key} time={time}>
          <TimerLabel>{key.toUpperCase()}</TimerLabel>
          <TimerValue>{formatTime(time)}</TimerValue>
        </TimerItem>
      ))}
    </TimerContainer>
  );
}


