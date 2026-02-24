import { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useGetAllPlayers, ALL_CATEGORIES, type CategoryFilterValue } from '../hooks/useQueries';
import TierRow from '../components/TierRow';
import CategoryFilter from '../components/CategoryFilter';
import { Tier } from '../backend';
import { useSearch } from '../lib/SearchContext';

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

export default function TierListPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterValue>(ALL_CATEGORIES);
  const { data: players = [], isLoading, isError } = useGetAllPlayers(selectedCategory);
  const { searchTerm } = useSearch();

  const filteredPlayers = searchTerm.trim()
    ? players.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : players;

  const playersByTier = TIERS.reduce((acc, tier) => {
    acc[tier] = filteredPlayers.filter((p) => p.tier === tier);
    return acc;
  }, {} as Record<Tier, typeof players>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tier-ht1/10 border border-tier-ht1/30">
            <LayoutGrid size={18} className="text-tier-ht1" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-app-fg">Tier List</h1>
        </div>
        <p className="text-app-muted text-sm ml-12">
          Players ranked from <span className="text-tier-ht1 font-bold">HT1</span> (best) to <span className="text-tier-lt5 font-bold">LT5</span> (lowest) based on performance score.
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
        <div className="space-y-3">
          {TIERS.map((tier) => (
            <div key={tier} className="h-32 rounded-lg bg-app-surface animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">
          <p className="font-bold">Failed to load players.</p>
          <p className="text-sm mt-1 opacity-80">Please try refreshing the page.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-2">
          {TIERS.map((tier) => (
            <TierRow key={tier} tier={tier} players={playersByTier[tier]} />
          ))}
        </div>
      )}

      {!isLoading && !isError && searchTerm && filteredPlayers.length === 0 && (
        <div className="text-center py-16 text-app-muted">
          <LayoutGrid size={40} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-bold">No players found for &ldquo;{searchTerm}&rdquo;</p>
          <p className="text-sm mt-1 opacity-70">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
