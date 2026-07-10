import { contentPack } from '@life-sim/content';
import { useGame } from '../store';

export function StatsBar() {
  const game = useGame(s => s.game);
  const view = useGame(s => s.view);
  if (view.kind === 'TITLE') return null;
  const { knowledge, money, mindset, network, health } = game.stats;
  const traits = contentPack.traits.filter(t => Boolean(game.flags[t.id]));
  const evolutions = contentPack.traitEvolutions.filter(item => Boolean(game.flags[item.id]));
  const goal = contentPack.lifeGoals.find(item => item.id === game.flags.life_goal);
  return (
    <div className="stats-bar">
      <span className="stats-year">{game.date.year} 年</span>
      {traits.length > 0 && (
        <span className="stats-traits">{traits.map(t => t.label).join(' · ')}</span>
      )}
      {goal && <span className="stats-traits">目标 · {goal.label}</span>}
      {evolutions.length > 0 && (
        <span className="stats-traits">成长 · {evolutions.map(item => item.label).join(' · ')}</span>
      )}
      <span className="stat">学识 {knowledge}</span>
      <span className="stat">金钱 ¥{money.toLocaleString()}</span>
      <span className="stat">心态 {mindset}</span>
      <span className="stat">人脉 {network}</span>
      <span className="stat">健康 {health}</span>
    </div>
  );
}
