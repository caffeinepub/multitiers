import { type Player, Tier } from '../backend';

interface PlayerCardProps {
  player: Player;
  rank?: number;
}

export const TIER_CONFIG: Record<Tier, { label: string; color: string; glow: string; bg: string }> = {
  [Tier.LT5]: { label: 'LT5', color: 'text-tier-lt5', glow: 'shadow-tier-lt5', bg: 'bg-tier-lt5/10 border-tier-lt5/30' },
  [Tier.HT5]: { label: 'HT5', color: 'text-tier-ht5', glow: 'shadow-tier-ht5', bg: 'bg-tier-ht5/10 border-tier-ht5/30' },
  [Tier.LT4]: { label: 'LT4', color: 'text-tier-lt4', glow: 'shadow-tier-lt4', bg: 'bg-tier-lt4/10 border-tier-lt4/30' },
  [Tier.HT4]: { label: 'HT4', color: 'text-tier-ht4', glow: 'shadow-tier-ht4', bg: 'bg-tier-ht4/10 border-tier-ht4/30' },
  [Tier.LT3]: { label: 'LT3', color: 'text-tier-lt3', glow: 'shadow-tier-lt3', bg: 'bg-tier-lt3/10 border-tier-lt3/30' },
  [Tier.HT3]: { label: 'HT3', color: 'text-tier-ht3', glow: 'shadow-tier-ht3', bg: 'bg-tier-ht3/10 border-tier-ht3/30' },
  [Tier.LT2]: { label: 'LT2', color: 'text-tier-lt2', glow: 'shadow-tier-lt2', bg: 'bg-tier-lt2/10 border-tier-lt2/30' },
  [Tier.HT2]: { label: 'HT2', color: 'text-tier-ht2', glow: 'shadow-tier-ht2', bg: 'bg-tier-ht2/10 border-tier-ht2/30' },
  [Tier.LT1]: { label: 'LT1', color: 'text-tier-lt1', glow: 'shadow-tier-lt1', bg: 'bg-tier-lt1/10 border-tier-lt1/30' },
  [Tier.HT1]: { label: 'HT1', color: 'text-tier-ht1', glow: 'shadow-tier-ht1', bg: 'bg-tier-ht1/10 border-tier-ht1/30' },
};

export default function PlayerCard({ player, rank }: PlayerCardProps) {
  const config = TIER_CONFIG[player.tier];

  return (
    <div
      className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border bg-card-bg ${config.bg} hover:scale-105 hover:shadow-card transition-all duration-200 cursor-default min-w-[100px] group`}
    >
      {rank !== undefined && (
        <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-app-surface border border-white/20 flex items-center justify-center text-[10px] font-black text-app-muted">
          {rank}
        </span>
      )}
      {/* Avatar */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border-2 ${config.bg} ${config.color} group-hover:shadow-${config.glow.replace('shadow-', '')} transition-shadow`}>
        {player.name.charAt(0).toUpperCase()}
      </div>
      {/* Name */}
      <span className="text-xs font-bold text-app-fg text-center leading-tight max-w-[90px] truncate">
        {player.name}
      </span>
      {/* Score */}
      <span className={`text-sm font-black ${config.color}`}>
        {Number(player.score).toLocaleString()}
      </span>
      {/* Tier badge */}
      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${config.bg} ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
}
