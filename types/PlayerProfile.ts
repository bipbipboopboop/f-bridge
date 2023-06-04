import {Card} from "./Card";
export interface PlayerProfile {
  // Personal Info
  id: string;
  email: string | null;
  displayName: string;
  country: string | "International";
  avatarID: string | null; // For future
  // status: "Online" | "Offline" | "In Lobby" | "In Game";

  // Game data
  numOfGamesWon: number;
  numOfGamesPlayed: number;
  roomID: string | null;
}

export interface LobbyPlayerProfile extends PlayerProfile {
  position: number;
  isReady: boolean;
  numCardsOnHand: number;
}

export interface GameRoomPlayer extends LobbyPlayerProfile {
  cards: Card[];
}
