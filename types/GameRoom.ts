// types/GameRoom.ts
import { BidSuit } from "./Bid";

export type GameRoom = {
  roomId: string;
  name: string;
  creatorId: string;
  createdAt: Date;
  players: string[]; // Array of player IDs
  currentPlayerIndex: number;
  biddingPhase: {
    currentBidderIndex: number;
    highestBidderIndex: number | null;
    highestBid: {
      suit: BidSuit;
      number: number;
    } | null;
    bidHistory: {
      playerId: string;
      bid: {
        suit: BidSuit;
        number: number;
      };
    }[];
  };
  trickTakingPhase: {
    currentTrick: {
      leadPlayerIndex: number;
      cards: {
        playerId: string;
        card: string; // Assuming a string representation of a card, e.g., 'AS' for Ace of Spades
      }[];
      winnerIndex: number | null;
    }[];
    currentTrickIndex: number;
    currentTrickWinnerIndex: number | null;
  };
  scores: {
    playerId: string;
    score: number;
  }[];
  settings: {
    inviteOnly: boolean;
    maxPlayers: number;
    trumpReveal: boolean;
    scoringMethod: "rubber" | "duplicate";
  };
};
