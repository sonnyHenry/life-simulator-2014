import { useGame } from '../store';

export function StatsBar() {
  const game = useGame(s => s.game);
  const view = useGame(s => s.view);
  if (view.kind === 'TITLE') return null;
  const { knowledge, money, mindset, network, health } = game.stats;
  return (
    <div className="stats-bar">
      <span className="stats-year">{game.date.year} 年</span>
      <span className="stat">学识 {knowledge}</span>
      <span className="stat">金钱 ¥{money.toLocaleString()}</span>
      <span className="stat">心态 {mindset}</span>
      <span className="stat">人脉 {network}</span>
      <span className="stat">健康 {health}</span>
    </div>
  );
}
