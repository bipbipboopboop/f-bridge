/**
 * Inside the common API, we will only use null and not undefined.
 * This is for ease of sending data between the backend and the frontend
 */
import { Timestamp } from "firebase-admin/firestore";
import { GameRoomPlayer } from "types/PlayerProfile";

export type BidNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type BidSuit =  "♣" | "♦" | "♥" | "♠" | "NT";

export type Bid = {
    number: BidNumber;
    suit: BidSuit;
};

export type BidRequest = {
    bid: Bid | null;
};

export type HighestBid = {
    bid: Bid;
    /**
     * Who made this bid?
     */
    playerID: string;
};

export type GameStatus = "Waiting" | "Bidding" | "Taking Trick" | "Picking Teammate";
export type PlayerPosition = 0 | 1 | 2 | 3;

export type GameState = {
    status: GameStatus;
    players: GameRoomPlayer[];
    biddingPhase: BiddingPhase | null;
    trickTakingPhase: TrickTakingPhase | null;
};

export type BiddingPhase = {
  currentPlayerIndex: PlayerPosition
  highestBid: HighestBid | null;
  numberOfPasses: number;
};

export type TrickTakingPhase = {
    currentPlayerIndex: PlayerPosition;
    /**
     * Who is the first player to start this round
     */
    leadPlayerIndex: PlayerPosition;
    trumpSuit: BidSuit;
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
