import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    id: bigint;
    name: string;
    tier: Tier;
    score: bigint;
    category: Category;
}
export enum Category {
    Axe = "Axe",
    SMP = "SMP",
    UHC = "UHC",
    Sword = "Sword",
    Mace = "Mace",
    Crystal = "Crystal",
    Spearmace = "Spearmace",
    DiamondSMP = "DiamondSMP"
}
export enum Tier {
    HT1 = "HT1",
    HT2 = "HT2",
    HT3 = "HT3",
    HT4 = "HT4",
    HT5 = "HT5",
    LT1 = "LT1",
    LT2 = "LT2",
    LT3 = "LT3",
    LT4 = "LT4",
    LT5 = "LT5"
}
export interface backendInterface {
    addPlayer(name: string, tier: Tier, score: bigint, category: Category): Promise<Player>;
    getAllPlayers(): Promise<Array<Player>>;
    getPlayersByCategory(category: Category): Promise<Array<Player>>;
    getPlayersByTier(tier: Tier): Promise<Array<Player>>;
    getPlayersByTierAndCategory(tier: Tier, category: Category): Promise<Array<Player>>;
    searchPlayersByName(searchTerm: string): Promise<Array<Player>>;
}
