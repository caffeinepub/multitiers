import { useNavigate } from '@tanstack/react-router';
import { Trophy, LayoutGrid, ChevronRight, Zap } from 'lucide-react';
import { useGetAllPlayers } from '../hooks/useQueries';
import { Tier } from '../backend';
import { TIER_CONFIG } from '../components/PlayerCard';

const TIERS = [
  Tier.LT5,
  Tier.HT5,
  Tier.LT4,
  Tier.HT4,
  Tier.LT3,
  Tier.HT3,
  Tier.LT2,
  Tier.HT2,
  Tier.LT1,
  Tier.HT1,
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: players = [], isLoading } = useGetAllPlayers();

  const tierCounts = TIERS.reduce((acc, tier) => {
    acc[tier] = players.filter((p) => p.tier === tier).length;
    return acc;
  }, {} as Record<Tier, number>);

  const topPlayers = [...players]
    .sort((a, b) => Number(b.score) - Number(a.score))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-tier-ht1/10 border border-tier-ht1/30 rounded-full px-4 py-1.5 mb-6">
          <Zap size={14} className="text-tier-ht1" />
          <span className="text-tier-ht1 text-xs font-bold uppercase tracking-widest">Competitive Rankings</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight mb-4">
          <span className="text-tier-ht1">MULTI</span>
          <span className="text-app-fg">TIERS</span>
        </h1>
        <p className="text-app-muted text-lg max-w-xl mx-auto mb-8">
          The definitive tier ranking platform. See where every player stands — from HT1 legends to LT5 newcomers.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate({ to: '/tier-list' })}
            className="flex items-center justify-center gap-2 bg-tier-ht1 text-black font-black uppercase tracking-wider px-8 py-3 rounded hover:bg-tier-ht1/90 transition-colors"
          >
            <LayoutGrid size={18} />
            View Tier List
          </button>
          <button
            onClick={() => navigate({ to: '/leaderboard' })}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/20 text-app-fg font-black uppercase tracking-wider px-8 py-3 rounded hover:bg-white/10 transition-colors"
          >
            <Trophy size={18} />
            Leaderboard
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-16">
        {TIERS.map((tier) => {
          const config = TIER_CONFIG[tier];
          return (
            <div
              key={tier}
              className={`rounded-lg border p-4 text-center ${config.bg} cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => navigate({ to: '/tier-list' })}
            >
              <div className={`text-2xl font-black ${config.color}`}>{tier}</div>
              <div className="text-app-muted text-xs uppercase tracking-wider mt-1">Tier</div>
              <div className={`text-xl font-black mt-2 ${config.color}`}>
                {isLoading ? '—' : tierCounts[tier]}
              </div>
              <div className="text-app-muted text-xs">players</div>
            </div>
          );
        })}
      </section>

      {/* Top 3 */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black uppercase tracking-wider text-app-fg flex items-center gap-2">
            <Trophy size={22} className="text-tier-ht1" />
            Top Players
          </h2>
          <button
            onClick={() => navigate({ to: '/leaderboard' })}
            className="flex items-center gap-1 text-tier-ht1 text-sm font-bold hover:text-tier-ht1/80 transition-colors"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-lg bg-app-surface animate-pulse" />
            ))}
          </div>
        ) : topPlayers.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-app-surface/50 p-10 text-center text-app-muted">
            <p className="text-lg font-bold">No players yet</p>
            <p className="text-sm mt-1">Add players to see the top rankings here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topPlayers.map((player, idx) => {
              const config = TIER_CONFIG[player.tier];
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={Number(player.id)}
                  className={`rounded-lg border p-5 flex items-center gap-4 ${config.bg} hover:scale-[1.02] transition-transform`}
                >
                  <span className="text-3xl">{medals[idx]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-app-fg text-lg truncate">{player.name}</div>
                    <div className={`text-sm font-bold ${config.color}`}>{config.label}</div>
                  </div>
                  <div className={`text-xl font-black ${config.color}`}>
                    {Number(player.score).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-tier-ht1/20 bg-tier-ht1/5 p-8 text-center">
        <h2 className="text-2xl font-black uppercase tracking-wider text-app-fg mb-2">
          Ready to explore the rankings?
        </h2>
        <p className="text-app-muted mb-6">Browse the full tier list or check the leaderboard for detailed rankings.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate({ to: '/tier-list' })}
            className="flex items-center justify-center gap-2 bg-tier-ht1 text-black font-black uppercase tracking-wider px-6 py-2.5 rounded hover:bg-tier-ht1/90 transition-colors"
          >
            <LayoutGrid size={16} />
            Tier List
          </button>
          <button
            onClick={() => navigate({ to: '/leaderboard' })}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/20 text-app-fg font-black uppercase tracking-wider px-6 py-2.5 rounded hover:bg-white/10 transition-colors"
          >
            <Trophy size={16} />
            Leaderboard
          </button>
        </div>
      </section>
    </div>
  );
}
