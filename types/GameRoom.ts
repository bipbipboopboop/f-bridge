// types/GameRoom.ts
import {Suit} from "./Card";
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
  scores: {
    playerID: string;
    score: number;
  }[];
};

export type BiddingPhase = {
  currentBidderIndex: 0 | 1 | 2 | 3;
  numBidsMade: number; // To determine bidIndex in bidHistory

  highestBid: {
    suit: Suit;
    number: number;
  } | null;

  bidHistory: {
    bidIndex: string; // To determine the order of the bids(i.e whether it's bid#1, bid#2)
    playerID: string;
    bid: {
      suit: Suit;
      number: number;
    };
  }[];
};

export type TrickTakingPhase = {
  currentPlayerIndex: number;
  leadPlayerIndex: number;

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

type Card = {
  suit: Suit;
  value: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  stringValue:
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "J"
    | "Q"
    | "K";
};
