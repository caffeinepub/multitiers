import { type Player, Tier } from '../backend';
import PlayerCard, { TIER_CONFIG } from './PlayerCard';

interface TierRowProps {
  tier: Tier;
  players: Player[];
}

export default function TierRow({ tier, players }: TierRowProps) {
  const config = TIER_CONFIG[tier];
  const tierKey = tier.toLowerCase();

  return (
    <div className="flex gap-0 rounded-lg overflow-hidden border border-white/10">
      {/* Tier Label */}
      <div
        className={`flex-shrink-0 w-16 sm:w-20 flex items-center justify-center font-black text-xl sm:text-2xl tracking-tight ${config.color} tier-label-${tierKey}`}
        style={{ minHeight: '120px' }}
      >
        {tier}
      </div>

      {/* Players */}
      <div className="flex-1 bg-app-surface/50 p-3 border-l border-white/10">
        {players.length === 0 ? (
          <div className="flex items-center h-full min-h-[96px]">
            <span className="text-app-muted text-sm italic">No players in this tier</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {players.map((player) => (
              <PlayerCard key={Number(player.id)} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
