// types/GameState.ts
import {Bid, BidSuit} from "types/Bid";
import {GameRoomPlayer, LobbyPlayerProfile} from "./PlayerProfile";

export type GameState = {
  roomID: string;
  hostID: string;
  createdAt: Date;
  settings: GameRoomSettings;
  invitedID: string[];

  status: "Waiting" | "Bidding" | "Taking Trick";
  players: LobbyPlayerProfile[];

  biddingPhase: BiddingPhase | null;
  trickTakingPhase: TrickTakingPhase | null;
};

export type BidSnapshot = {
  p0: {
    info: {
      id: string;
      displayName: string;
    };
    bid: Bid | null;
  };
  p1: {
    info: {
      id: string;
      displayName: string;
    };
    bid: Bid | null;
  };
  p2: {
    info: {
      id: string;
      displayName: string;
    };
    bid: Bid | null;
  };
  p3: {
    info: {
      id: string;
      displayName: string;
    };
    bid: Bid | null;
  };
};

export type BiddingPhase = {
  currentBidderIndex: 0 | 1 | 2 | 3;

  highestBid: Bid | null;

  gameroomPlayersList: GameRoomPlayer[];

  bidHistory: BidSnapshot[];
};

export type TrickTakingPhase = {
  currentPlayerIndex: 0 | 1 | 2 | 3;
  leadPlayerIndex: 0 | 1 | 2 | 3;
  trumpSuit: BidSuit;

  gameroomPlayersList: GameRoomPlayer[];
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

/**
 * LPI = 3 -> 1 2 3 0
 * LPI = 2 -> 2 3 0 1
 * LPI = 1 -> 3 0 1 2
 * LPI = 0 -> 0 1 2 3
 * z-index = (playerIndex - LPI  + 4) % 4
 *
 * pos = 0 : btm:0, left: 1, top: 2, right: 3
 * pos = 1 : btm:1, left: 2, top: 3, right: 0
 * pos = 2 : btm:2, left: 3, top: 0, right: 1
 * pos = 3 : btm:3, left: 0, top: 1, right: 2
 *
 */
