// types/GameRoom.ts
import {BidSuit, Card} from "./Card";
import {Bid} from "types/Bid";
import {
  GameRoomPlayer,
  LobbyPlayerProfile,
  PlayerProfile,
} from "./PlayerProfile";

export type GameRoom = {
  hostID: string;
  createdAt: Date;
  settings: GameRoomSettings;
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
    player: GameRoomPlayer;
    bid: Bid;
  }[];
};

export type TrickTakingPhase = {
  currentPlayerIndex: number;
  leadPlayerIndex: number;
  trumpSuit: BidSuit;

  currentTrick: {
    player: GameRoomPlayer;
    card: Card;
  }[];

  scores: GameScore[];
};

export type GameScore = {
  playerID: string;
  position: 0 | 1 | 2 | 3;
  numTricksWon: number;
};

export type GameRoomSettings = {
  isInviteOnly: boolean;
  isSpectatorAllowed: boolean;
};
