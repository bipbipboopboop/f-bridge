import { Card } from "./Card";
export type AvatarID = "blueDino" | "redDino" | "yellowDino" | "greenDino";
export interface PlayerProfile {
  // Personal Info
  id: string;
  email: string | null;
  displayName: string;
  country: string | "International";
  avatarID: AvatarID;
  // status: "Online" | "Offline" | "In Lobby" | "In Game";

  // Game data
  numOfGamesWon: number;
  numOfGamesPlayed: number;
  roomID: string | null;
}

export interface LobbyPlayerProfile extends PlayerProfile {
  position: number;
  isReady: boolean;
  isHost: boolean;
}

export interface GameRoomPlayer {
  id: string;
  displayName: string;
  avatarID: AvatarID;
  position: number;
  numCardsOnHand: number;
  numTricksWon: number;
  currentCardOnTable: Card | null;
}

// gamePlayers subcollection
export interface GamePlayer extends LobbyPlayerProfile {
  cards: Card[];
  team: "Defender" | "Declarer" | null;
  numTricksWon: number;
  position: number;
  numCardsOnHand: number;
}
