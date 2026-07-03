import { useGame } from './store';
import { StatsBar } from './components/StatsBar';
import {
  ApplicationScreen,
  BackgroundDrawScreen,
  CrossroadScreen,
  ExamResultScreen,
  ExamScreen,
  SetupScreen,
  TitleScreen,
} from './screens/FlowScreens';
import {
  BriefScreen,
  EndingScreen,
  EventScreen,
  OutcomeScreen,
  SettlementScreen,
} from './screens/RoundScreens';

function Screen() {
  const view = useGame(s => s.view);
  switch (view.kind) {
    case 'TITLE':
      return <TitleScreen view={view} />;
    case 'BACKGROUND_DRAW':
      return <BackgroundDrawScreen view={view} />;
    case 'SETUP':
      return <SetupScreen view={view} />;
    case 'EXAM':
      return <ExamScreen view={view} />;
    case 'EXAM_RESULT':
      return <ExamResultScreen view={view} />;
    case 'APPLICATION':
      return <ApplicationScreen view={view} />;
    case 'CROSSROAD':
      return <CrossroadScreen view={view} />;
    case 'BRIEF':
      return <BriefScreen view={view} />;
    case 'EVENT':
      return <EventScreen view={view} />;
    case 'OUTCOME':
      return <OutcomeScreen view={view} />;
    case 'SETTLEMENT':
      return <SettlementScreen view={view} />;
    case 'ENDING':
      return <EndingScreen view={view} />;
  }
}

export default function App() {
  const game = useGame(s => s.game);
  const view = useGame(s => s.view);
  const screenKey = [
    view.kind,
    game.phaseIndex,
    game.roundIndex,
    game.eventCursor,
    game.examCursor,
    game.history.length,
  ].join('-');
  return (
    <div className="app">
      <StatsBar />
      <main className="screen-wrap" key={screenKey}>
        <Screen />
      </main>
    </div>
  );
}
