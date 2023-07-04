/**
 * Inside the common API, we will only use null and not undefined.
 * This is for ease of sending data between the backend and the frontend
 */
import { Timestamp } from "firebase-admin/firestore";

export type BidNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type BidSuit = "♣" | "♦" | "♥" | "♠" | "NT";

export type Bid = {
  number: BidNumber;
  suit: BidSuit;
};

export type HighestBid = {
  bid: Bid;
  /**
   * Who made this bid?
   */
  playerID: string;
  position: PlayerPosition;
};

export type PlayedCard = {
  card: Card;
  /**
   * Who played this card?
   */
  playerID: string;
  position: PlayerPosition;
};

export type GameStatus = "waiting" | "bidding" | "picking teammate" | "taking trick" | "game over";
export type PlayerPosition = 0 | 1 | 2 | 3;
export type PlayerPositionPair = [PlayerPosition, PlayerPosition];
export type TeamLabel = "declarer" | "defender";

export type GameState = {
  status: GameStatus;
  biddingPhase: BiddingPhase | null;
  pickingTeammatePhase: PickingTeammatePhase | null;
  takingTrickPhase: TakingTrickPhase | null;
  winners: PlayerPositionPair | null;
};

export type GameRoomPlayer = {
  ID: string;
  position: PlayerPosition;
  cardsOnHand: Card[];
  teamLabel: TeamLabel | null;
};

export type GameRoomTeam = {
  label: TeamLabel;
  players: PlayerPositionPair;
  tricksWon: number;
  tricksNeeded: number;
};

export type BiddingPhase = {
  currentPlayerPosition: PlayerPosition;
  highestBid: HighestBid | null;
  numberOfPasses: number;
};

export type PickingTeammatePhase = {
  trumpSuit: BidSuit;
  bidNumber: BidNumber;
  playerPosition: PlayerPosition;
};

export type TakingTrickPhase = {
  currentPlayerPosition: PlayerPosition;
  trumpSuit: BidSuit;
  cardsOnBoard: PlayedCard[];
};

export type GameMetadata = {
  hostID: string;
  createdAt: Timestamp;
};

export type GameSettings = {
  isInviteOnly: boolean;
  isSuddenDeath: boolean;
  isSpectatorAllowed: boolean;
  invitedID: string[];
};

export type GameRoom = {
  roomID: string;
  state: GameState;
  metadata: GameMetadata;
  settings: GameSettings;
};

export type CardSuit = "♣" | "♦" | "♥" | "♠";
export type CardValue = "A" | "K" | "Q" | "J" | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";
export type Card = {
  value: CardValue;
  suit: CardSuit;
};
