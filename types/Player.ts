import { AvatarID } from "./Avatar";
import { Card } from "./Card";

// Public
export interface PublicPlayer {
  id: string;
  displayName: string;
  avatarID: AvatarID;

  roomID: string;
  isReady: boolean;
  isHost: boolean;

  position: 0 | 1 | 2 | 3 | null;
  numCardsOnHand: number;
  numTricksWon: number;
  currentCardOnTable: Card | null;
}
