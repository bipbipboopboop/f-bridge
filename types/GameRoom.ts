// types/GameRoom.ts
import {BidSuit, Card} from "./Card";
import {Bid} from "types/Bid";
import {LobbyPlayerProfile, PlayerProfile} from "./PlayerProfile";

export type GameRoom = {
  hostID: string;
  createdAt: Date;
  settings: {
    isInviteOnly: boolean;
    isSpectatorAllowed: boolean;
  };
  invitedID: string[];

  status: "Waiting" | "Bidding" | "Taking Trick";
  players: LobbyPlayerProfile[];

  biddingPhase: BiddingPhase | null;
  trickTakingPhase: TrickTakingPhase | null;
};

export type BiddingPhase = {
  currentBidderIndex: 0 | 1 | 2 | 3;
  numBidsMade: number; // To determine bidIndex in bidHistory

  highestBid: Bid | null;

  bidHistory: {
    bidIndex: string; // To determine the order of the bids(i.e whether it's bid#1, bid#2)
    playerID: string;
    bid: Bid;
  }[];
};

export type TrickTakingPhase = {
  currentPlayerIndex: number;
  leadPlayerIndex: number;
  trumpSuit: BidSuit;

  currentTrick: {
    cards: {
      playerID: string;
      card: Card;
    }[];
  }[];

  scores: {
    playerID: string;
    position: string;
    numTricksWon: number;
  }[];
};

// gamePlayers subcollection
export interface GamePlayer extends PlayerProfile {
  cards: Card[];
  team: "Defender" | "Declarer" | null;
  numTricksWon: number;
  position: number;
}
