/**
 * Inside the common API, we will only use null and not undefined.
 * This is for ease of sending data between the backend and the frontend
 */
import { Timestamp } from "firebase-admin/firestore";
import { BidSuit } from "types/Bid";
import { GameRoomPlayer } from "types/PlayerProfile";

export type Bid = {
    number: number;
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
    playerId: string;
};

export type GameMetadata = {
    hostID: string;
    createdAt: Timestamp;
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

export type GameSettings = {
    isInviteOnly: boolean;
    isSpectatorAllowed: boolean;
    invitedID: string[];
};

export type GameRoom = {
    roomID: string;
    state: GameState;
    metadata: GameMetadata;
    settings: GameSettings;
};

/**
 * What are the sensitive data?
 * - The teammate of a player
 * - The current hand of a player
 */ 
