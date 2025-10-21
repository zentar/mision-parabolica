import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { state, subscribe } from './state/store';
import SessionForm from './components/common/SessionForm';
import TeacherView from './components/teacher/TeacherView';
import TeamView from './components/team/TeamView';
import { NotificationContainer, useNotification } from './components/common/Notification';

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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 8px 0 0 0;
  font-weight: 300;
`;

const MainContent = styled.main`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

function useStore() {
  const [, setTick] = React.useState(0);
  React.useEffect(() => {
    const fn = () => setTick(x => x + 1);
    subscribe(fn);
  }, []);
  return state;
}

export default function App() {
  const s = useStore();
  const { showNotification } = useNotification();

  const handleSessionCreated = (result) => {
    showNotification('Sesión creada exitosamente', 'success');
  };

  const handleTeamJoined = (result) => {
    showNotification('Equipo unido exitosamente', 'success');
  };

  return (
    <AppContainer>
      <GlobalStyle />
      <Header>
        <Title>🚀 Misión Parabólica</Title>
        <Subtitle>Explora las propiedades de las parábolas en una aventura matemática</Subtitle>
      </Header>
      
      <MainContent>
        {!s.session && (
          <SessionForm 
            onSessionCreated={handleSessionCreated}
            onTeamJoined={handleTeamJoined}
          />
        )}

        {s.session && s.role === 'teacher' && <TeacherView session={s.session} />}
        {s.session && s.role === 'team' && <TeamView session={s.session} team={s.team} />}
      </MainContent>
      
      <NotificationContainer />
    </AppContainer>
  );
}
