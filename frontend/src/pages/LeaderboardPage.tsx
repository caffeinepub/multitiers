import { useState } from 'react';
import { Trophy, Medal } from 'lucide-react';
import { useGetAllPlayers, ALL_CATEGORIES, type CategoryFilterValue } from '../hooks/useQueries';
import CategoryFilter from '../components/CategoryFilter';
import { TIER_CONFIG } from '../components/PlayerCard';
import { Tier } from '../backend';
import { useSearch } from '../lib/SearchContext';

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterValue>(ALL_CATEGORIES);
  const { data: players = [], isLoading, isError } = useGetAllPlayers(selectedCategory);
  const { searchTerm } = useSearch();

  const sorted = [...players].sort((a, b) => Number(b.score) - Number(a.score));

  const filtered = searchTerm.trim()
    ? sorted.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : sorted;

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { badge: '🥇', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
    if (rank === 2) return { badge: '🥈', bg: 'bg-slate-400/10', text: 'text-slate-300', border: 'border-slate-400/20' };
    if (rank === 3) return { badge: '🥉', bg: 'bg-orange-700/10', text: 'text-orange-400', border: 'border-orange-700/20' };
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tier-ht1/10 border border-tier-ht1/30">
            <Trophy size={18} className="text-tier-ht1" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-app-fg">Leaderboard</h1>
        </div>
        <p className="text-app-muted text-sm ml-12">
          All players ranked by score — highest to lowest.
          {searchTerm && (
            <span className="ml-2 text-tier-ht1 font-semibold">
              Showing results for &ldquo;{searchTerm}&rdquo;
            </span>
          )}
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 p-4 bg-app-surface/50 rounded-lg border border-white/10">
        <p className="text-app-muted text-xs font-bold uppercase tracking-widest mb-3">Filter by Category</p>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-app-surface animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">
          <p className="font-bold">Failed to load leaderboard.</p>
          <p className="text-sm mt-1 opacity-80">Please try refreshing the page.</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="text-center py-16 text-app-muted">
          <Trophy size={40} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-bold">
            {searchTerm ? `No players found for "${searchTerm}"` : 'No players yet'}
          </p>
          <p className="text-sm mt-1 opacity-70">
            {searchTerm ? 'Try a different search term.' : 'Add players via the Admin panel to see rankings.'}
          </p>
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="rounded-xl border border-white/10 overflow-hidden shadow-card">
          {/* Table header */}
          <div className="grid grid-cols-[52px_1fr_100px_110px] sm:grid-cols-[68px_1fr_120px_130px] bg-app-surface px-4 py-3 border-b border-white/15">
            <span className="text-app-muted text-[11px] font-black uppercase tracking-widest">#</span>
            <span className="text-app-muted text-[11px] font-black uppercase tracking-widest">Player</span>
            <span className="text-app-muted text-[11px] font-black uppercase tracking-widest text-center">Tier</span>
            <span className="text-app-muted text-[11px] font-black uppercase tracking-widest text-right">Score</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.map((player) => {
              const actualRank = sorted.findIndex((p) => p.id === player.id) + 1;
              const config = TIER_CONFIG[player.tier as Tier];
              const rankStyle = getRankStyle(actualRank);

              return (
                <div
                  key={Number(player.id)}
                  className={`grid grid-cols-[52px_1fr_100px_110px] sm:grid-cols-[68px_1fr_120px_130px] items-center px-4 py-3.5 hover:bg-white/5 transition-colors ${
                    rankStyle ? `${rankStyle.bg} border-l-2 ${rankStyle.border}` : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center">
                    {rankStyle ? (
                      <span className="text-xl leading-none">{rankStyle.badge}</span>
                    ) : (
                      <span className="text-app-muted font-black text-sm w-7 text-center tabular-nums">{actualRank}</span>
                    )}
                  </div>

                  {/* Player name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border ${config.bg} ${config.color} flex-shrink-0`}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-app-fg truncate block">{player.name}</span>
                      <span className="text-app-muted text-[11px] truncate block">{player.category}</span>
                    </div>
                  </div>

                  {/* Tier badge */}
                  <div className="flex justify-center">
                    <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${config.bg} ${config.color}`}>
                      {player.tier}
                    </span>
                  </div>

                  {/* Score */}
                  <div className={`text-right font-black text-sm tabular-nums ${config.color}`}>
                    {Number(player.score).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer count */}
          <div className="bg-app-surface px-4 py-2.5 border-t border-white/10 text-right">
            <span className="text-app-muted text-xs font-medium">
              {filtered.length} player{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
