import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Trophy, LayoutGrid, ChevronRight, Zap, Settings, Users, Star } from 'lucide-react';
import { useGetAllPlayers } from '../hooks/useQueries';
import { Tier } from '../backend';
import { TIER_CONFIG } from '../components/PlayerCard';
import AdminModal from '../components/AdminModal';

const TIERS = [
  Tier.HT1,
  Tier.LT1,
  Tier.HT2,
  Tier.LT2,
  Tier.HT3,
  Tier.LT3,
  Tier.HT4,
  Tier.LT4,
  Tier.HT5,
  Tier.LT5,
];

export default function HomePage() {
  const navigate = useNavigate();
  const { data: players = [], isLoading } = useGetAllPlayers();
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const tierCounts = TIERS.reduce((acc, tier) => {
    acc[tier] = players.filter((p) => p.tier === tier).length;
    return acc;
  }, {} as Record<Tier, number>);

  const topPlayers = [...players]
    .sort((a, b) => Number(b.score) - Number(a.score))
    .slice(0, 3);

  const totalPlayers = players.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <section className="text-center mb-16 relative">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-40 rounded-full bg-tier-ht1/8 blur-3xl animate-pulse-glow" />
        </div>

        <div className="inline-flex items-center gap-2 bg-tier-ht1/10 border border-tier-ht1/30 rounded-full px-4 py-1.5 mb-6">
          <Zap size={13} className="text-tier-ht1" />
          <span className="text-tier-ht1 text-xs font-black uppercase tracking-widest">Competitive Rankings</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tight mb-4 leading-none">
          <span className="text-tier-ht1" style={{ textShadow: '0 0 40px var(--tier-ht1)' }}>MULTI</span>
          <span className="text-app-fg">TIERS</span>
        </h1>
        <p className="text-app-muted text-lg max-w-xl mx-auto mb-3">
          The definitive tier ranking platform for competitive players.
        </p>
        <p className="text-app-muted/70 text-sm max-w-md mx-auto mb-8">
          From <span className="text-tier-ht1 font-bold">HT1 legends</span> to <span className="text-tier-lt5 font-bold">LT5 newcomers</span> — every rank, every category.
        </p>

        {/* Stats pill */}
        {!isLoading && totalPlayers > 0 && (
          <div className="inline-flex items-center gap-2 bg-app-surface border border-white/15 rounded-full px-4 py-1.5 mb-8 text-sm text-app-muted">
            <Users size={13} className="text-tier-ht1" />
            <span><span className="text-app-fg font-bold">{totalPlayers}</span> players ranked</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate({ to: '/tier-list' })}
            className="flex items-center justify-center gap-2 bg-tier-ht1 text-black font-black uppercase tracking-wider px-8 py-3 rounded-md hover:bg-tier-ht1/90 hover:shadow-glow-ht1 transition-all duration-200"
          >
            <LayoutGrid size={18} />
            View Tier List
          </button>
          <button
            onClick={() => navigate({ to: '/leaderboard' })}
            className="flex items-center justify-center gap-2 bg-app-surface border border-white/20 text-app-fg font-black uppercase tracking-wider px-8 py-3 rounded-md hover:bg-app-surface2 hover:border-white/30 transition-all duration-200"
          >
            <Trophy size={18} />
            Leaderboard
          </button>
        </div>
      </section>

      {/* Tier Stats Grid */}
      <section className="mb-16">
        <h2 className="text-lg font-black uppercase tracking-widest text-app-muted mb-4 flex items-center gap-2">
          <Star size={16} className="text-tier-ht1" />
          Tier Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TIERS.map((tier) => {
            const config = TIER_CONFIG[tier];
            return (
              <button
                key={tier}
                className={`rounded-lg border p-4 text-center ${config.bg} hover:scale-105 hover:shadow-card transition-all duration-200 group`}
                onClick={() => navigate({ to: '/tier-list' })}
              >
                <div className={`text-2xl font-black ${config.color} group-hover:drop-shadow-lg`}>{tier}</div>
                <div className="text-app-muted text-[10px] uppercase tracking-wider mt-1 mb-2">Tier</div>
                <div className={`text-2xl font-black ${config.color}`}>
                  {isLoading ? (
                    <span className="inline-block w-6 h-5 bg-app-surface2 rounded animate-pulse" />
                  ) : (
                    tierCounts[tier]
                  )}
                </div>
                <div className="text-app-muted text-[10px]">players</div>
              </button>
            );
          })}
        </div>
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
            <Trophy size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-bold">No players yet</p>
            <p className="text-sm mt-1 opacity-70">Add players via the Admin panel to see rankings here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topPlayers.map((player, idx) => {
              const config = TIER_CONFIG[player.tier];
              const medals = ['🥇', '🥈', '🥉'];
              const rankLabels = ['1st Place', '2nd Place', '3rd Place'];
              return (
                <div
                  key={Number(player.id)}
                  className={`rounded-lg border p-5 flex items-center gap-4 ${config.bg} hover:scale-[1.02] hover:shadow-card transition-all duration-200 ${idx === 0 ? 'ring-1 ring-tier-ht1/40' : ''}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-3xl">{medals[idx]}</span>
                    <span className="text-[10px] text-app-muted font-bold uppercase tracking-wider">{rankLabels[idx]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-app-fg text-lg truncate">{player.name}</div>
                    <div className={`text-sm font-bold ${config.color}`}>{config.label}</div>
                    <div className="text-app-muted text-xs mt-0.5">{player.category}</div>
                  </div>
                  <div className={`text-xl font-black ${config.color} text-right`}>
                    <div>{Number(player.score).toLocaleString()}</div>
                    <div className="text-[10px] text-app-muted font-normal">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-tier-ht1/20 bg-tier-ht1/5 p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-tier-ht1/10 blur-2xl rounded-full" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-wider text-app-fg mb-2">
          Ready to explore the rankings?
        </h2>
        <p className="text-app-muted mb-6 text-sm">Browse the full tier list or check the leaderboard for detailed rankings.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate({ to: '/tier-list' })}
            className="flex items-center justify-center gap-2 bg-tier-ht1 text-black font-black uppercase tracking-wider px-6 py-2.5 rounded-md hover:bg-tier-ht1/90 hover:shadow-glow-ht1 transition-all duration-200"
          >
            <LayoutGrid size={16} />
            Tier List
          </button>
          <button
            onClick={() => navigate({ to: '/leaderboard' })}
            className="flex items-center justify-center gap-2 bg-app-surface border border-white/20 text-app-fg font-black uppercase tracking-wider px-6 py-2.5 rounded-md hover:bg-app-surface2 transition-all duration-200"
          >
            <Trophy size={16} />
            Leaderboard
          </button>
        </div>
      </section>

      {/* Admin Access Button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setAdminModalOpen(true)}
          className="flex items-center gap-2 text-app-muted hover:text-app-fg border border-white/10 hover:border-tier-ht1/40 bg-transparent hover:bg-tier-ht1/5 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-md transition-all duration-200"
        >
          <Settings size={13} />
          Admin Panel
        </button>
      </div>

      {/* Admin Modal */}
      <AdminModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </div>
  );
}
