import { AvatarID } from "./Avatar";

// Public
export interface RestrictedAccountInfo {
  // Personal Info
  id: string;
  displayName: string;
  avatarID: AvatarID;

  email: string | null;
  country: string | "International";
  // status: "Online" | "Offline" | "In Lobby" | "In Game";

  // Game data
  numOfGamesWon: number;
  numOfGamesPlayed: number;
  roomID: string | null;
}
