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
    avatarUrl?: string;
    category: Category;
}
export interface UserProfile {
    name: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPlayer(name: string, tier: Tier, score: bigint, category: Category, avatarUrl: string | null): Promise<Player>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllPlayers(): Promise<Array<Player>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPlayersByCategory(category: Category): Promise<Array<Player>>;
    getPlayersByTier(tier: Tier): Promise<Array<Player>>;
    getPlayersByTierAndCategory(tier: Tier, category: Category): Promise<Array<Player>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removePlayer(playerId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPlayersByName(searchTerm: string): Promise<Array<Player>>;
}
