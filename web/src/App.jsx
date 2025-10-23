import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { state, subscribe } from './state/store';
import SessionForm from './components/common/SessionForm';
import TeacherView from './components/teacher/TeacherView';
import TeamView from './components/team/TeamView';
import Logo from './components/common/Logo';
import UniversityLogo from './components/common/UniversityLogo';
import Footer from './components/common/Footer';
import HelpSection from './components/common/HelpSection';
import { NotificationProvider, useNotification } from './components/common/Notification';

// Global styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Montserrat', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #A90046 0%, #90046 50%, #303132 100%);
    min-height: 100vh;
    color: #303132;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #A90046 0%, #90046 50%, #303132 100%);
`;

const Header = styled.header`
  background: rgba(48, 49, 50, 0.95);
  backdrop-filter: blur(20px);
  padding: 30px 0;
  text-align: center;
  border-bottom: 3px solid #A90046;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const MainContent = styled.main`
  padding: 50px 20px;
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

function AppContent() {
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
        <HeaderContent>
          <UniversityLogo />
          <Logo />
        </HeaderContent>
      </Header>
      
      <MainContent>
        {!s.session && (
          <>
            <SessionForm 
              onSessionCreated={handleSessionCreated}
              onTeamJoined={handleTeamJoined}
            />
            <HelpSection />
          </>
        )}

        {s.session && s.role === 'teacher' && <TeacherView session={s.session} />}
        {s.session && s.role === 'team' && <TeamView session={s.session} team={s.team} />}
      </MainContent>
      
      <Footer />
    </AppContainer>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}
