import { useState } from 'react';
import { Trophy } from 'lucide-react';
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

  const rankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy size={24} className="text-tier-ht1" />
          <h1 className="text-3xl font-black uppercase tracking-wider text-app-fg">Leaderboard</h1>
        </div>
        <p className="text-app-muted">
          All players ranked by score — highest to lowest.
          {searchTerm && (
            <span className="ml-2 text-tier-ht1 font-semibold">
              Showing results for "{searchTerm}"
            </span>
          )}
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
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
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
          Failed to load leaderboard. Please try again.
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="text-center py-16 text-app-muted">
          <p className="text-lg font-bold">No players found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[48px_1fr_90px_100px] sm:grid-cols-[64px_1fr_110px_120px] bg-app-surface px-4 py-3 border-b border-white/10">
            <span className="text-app-muted text-xs font-black uppercase tracking-widest">#</span>
            <span className="text-app-muted text-xs font-black uppercase tracking-widest">Player</span>
            <span className="text-app-muted text-xs font-black uppercase tracking-widest text-center">Tier</span>
            <span className="text-app-muted text-xs font-black uppercase tracking-widest text-right">Score</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.map((player) => {
              const actualRank = sorted.findIndex((p) => p.id === player.id) + 1;
              const config = TIER_CONFIG[player.tier as Tier];
              const medal = rankMedal(actualRank);

              return (
                <div
                  key={Number(player.id)}
                  className={`grid grid-cols-[48px_1fr_90px_100px] sm:grid-cols-[64px_1fr_110px_120px] items-center px-4 py-3.5 hover:bg-white/5 transition-colors ${
                    actualRank <= 3 ? 'bg-tier-ht1/5' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center gap-1">
                    {medal ? (
                      <span className="text-lg">{medal}</span>
                    ) : (
                      <span className="text-app-muted font-black text-sm w-6 text-center">{actualRank}</span>
                    )}
                  </div>

                  {/* Player name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border ${config.bg} ${config.color} flex-shrink-0`}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-app-fg truncate">{player.name}</span>
                  </div>

                  {/* Tier badge */}
                  <div className="flex justify-center">
                    <span className={`text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded border ${config.bg} ${config.color}`}>
                      {player.tier}
                    </span>
                  </div>

                  {/* Score */}
                  <div className={`text-right font-black text-sm ${config.color}`}>
                    {Number(player.score).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
