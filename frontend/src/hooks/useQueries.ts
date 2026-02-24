import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Player, Tier, Category } from '../backend';

export const ALL_CATEGORIES = 'all' as const;
export type CategoryFilterValue = Category | typeof ALL_CATEGORIES;

export function useGetAllPlayers(category: CategoryFilterValue = ALL_CATEGORIES) {
  const { actor, isFetching } = useActor();

  return useQuery<Player[]>({
    queryKey: ['players', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === ALL_CATEGORIES) {
        return actor.getAllPlayers();
      }
      return actor.getPlayersByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPlayersByTier(tier: Tier) {
  const { actor, isFetching } = useActor();

  return useQuery<Player[]>({
    queryKey: ['players', 'tier', tier],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlayersByTier(tier);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchPlayers(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Player[]>({
    queryKey: ['players', 'search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      if (!searchTerm.trim()) return actor.getAllPlayers();
      return actor.searchPlayersByName(searchTerm);
    },
    enabled: !!actor && !isFetching,
  });
}

interface AddPlayerInput {
  name: string;
  tier: Tier;
  category: Category;
  score: bigint;
  avatarUrl?: string | null;
}

export function useAddPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Player, Error, AddPlayerInput>({
    mutationFn: async ({ name, tier, category, score, avatarUrl }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addPlayer(name, tier, score, category, avatarUrl ?? null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}

export function useRemovePlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (playerId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removePlayer(playerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}
