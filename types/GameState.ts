import { Bid, BidSuit } from "./Bid";
import { Card } from "./Card";
import { PublicPlayer } from "./Player";

// Public to players within a room
export type PublicBiddingPhase = {
  currentPlayerIndex: 0 | 1 | 2 | 3;
  numPasses: number;
  highestBid: Bid | null;
  bidHistory: Bid[];
};

export type PublicTeammateChoosingPhase = {
  currentPlayerIndex: 0 | 1 | 2 | 3;
  trumpSuit: BidSuit | null;
};

export type PublicTrickTakingPhase = {
  currentPlayerIndex: 0 | 1 | 2 | 3;
  leadPlayerIndex: 0 | 1 | 2 | 3;
  trumpSuit: BidSuit | null;
};

export type PublicEndedPhase = {
  winnerTeam: "Defender" | "Declarer";
  winners: PublicPlayer[];
};

export interface RestrictedPlayerData {
  id: string;
  cards: Card[];
}

// Private
export interface PrivateTrickTakingPhase extends PublicTrickTakingPhase {
  defenderTeam: {
    tricksWon: number;
    tricksNeeded: number;
    players: PublicPlayer[];
  };
  declarerTeam: {
    tricksWon: number;
    tricksNeeded: number;
    players: PublicPlayer[];
  };
}
