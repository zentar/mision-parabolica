import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { state, subscribe } from './state/store';
import SessionForm from './components/common/SessionForm';
import TeacherView from './components/teacher/TeacherView';
import TeamView from './components/team/TeamView';
import { NotificationProvider } from './components/common/Notification';
import { useNotification } from './hooks/useNotification';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f8f9fa;
    color: #495057;
    line-height: 1.6;
  }
  
  code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
  font-size: 1.2rem;
`;

function useStore() {
  const [, setTick] = React.useState(0);
  
  React.useEffect(() => {
    const fn = () => setTick(x => x + 1);
    subscribe(fn);
    return () => subscribe(fn);
  }, []);
  
  return state;
}

export default function App() {
  const store = useStore();
  const { notifications, removeNotification } = useNotification();

  const handleSessionCreated = (result) => {
    console.log('Session created:', result);
  };

  const handleTeamJoined = (result) => {
    console.log('Team joined:', result);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>🚀 Misión Parabólica</Title>
          <Subtitle>Taller Interactivo de Matemáticas</Subtitle>
        </Header>

        <MainContent>
          {!store.session && (
            <SessionForm 
              onSessionCreated={handleSessionCreated}
              onTeamJoined={handleTeamJoined}
            />
          )}

          {store.session && store.role === 'teacher' && (
            <TeacherView session={store.session} />
          )}

          {store.session && store.role === 'team' && (
            <TeamView session={store.session} team={store.team} />
          )}
        </MainContent>

        <NotificationProvider>
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              {...notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </NotificationProvider>
      </AppContainer>
    </>
  );
}


