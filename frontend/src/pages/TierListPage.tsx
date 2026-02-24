import { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useGetAllPlayers, ALL_CATEGORIES, type CategoryFilterValue } from '../hooks/useQueries';
import TierRow from '../components/TierRow';
import CategoryFilter from '../components/CategoryFilter';
import { Tier } from '../backend';
import { useSearch } from '../lib/SearchContext';

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
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <LayoutGrid size={24} className="text-tier-ht1" />
          <h1 className="text-3xl font-black uppercase tracking-wider text-app-fg">Tier List</h1>
        </div>
        <p className="text-app-muted">
          Players ranked from HT1 (best) to LT5 (lowest) based on their performance score.
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
        <div className="space-y-3">
          {TIERS.map((tier) => (
            <div key={tier} className="h-32 rounded-lg bg-app-surface animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
          Failed to load players. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {TIERS.map((tier) => (
            <TierRow key={tier} tier={tier} players={playersByTier[tier]} />
          ))}
        </div>
      )}

      {!isLoading && !isError && searchTerm && filteredPlayers.length === 0 && (
        <div className="text-center py-16 text-app-muted">
          <p className="text-lg font-bold">No players found for "{searchTerm}"</p>
          <p className="text-sm mt-1">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
