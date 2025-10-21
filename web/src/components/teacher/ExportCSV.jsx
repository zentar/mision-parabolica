import styled from 'styled-components';
import Button from '../common/Button';
import Card from '../common/Card';

const ExportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ExportButton = styled(Button)`
  align-self: flex-start;
`;

const ExportInfo = styled.div`
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
`;

export default function ExportCSV({ session }) {
  const handleExport = () => {
    const csv = [
      'Equipo,Puntaje,M1,M2,M3,Final'
    ].concat(
      (session.teams || []).map(team => {
        const progress = team.progress;
        return [
          team.name,
          team.score,
          progress.m1.isCorrect,
          progress.m2.isCorrect,
          progress.m3.isCorrect,
          progress.final.isCorrect
        ].join(',');
      })
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `mision-parabolica-${session.code}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card title="Exportar Resultados">
      <ExportContainer>
        <ExportInfo>
          Exporta los resultados de la sesión en formato CSV para análisis posterior.
          Incluye puntajes, estado de misiones y progreso de cada equipo.
        </ExportInfo>
        <ExportButton onClick={handleExport}>
          📊 Exportar CSV
        </ExportButton>
      </ExportContainer>
    </Card>
  );
}


