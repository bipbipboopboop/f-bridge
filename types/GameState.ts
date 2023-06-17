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
  currentPlayerIndex: 0 | 1 | 2 | 3;

  highestBid: Bid | null;

  gameroomPlayersList: GameRoomPlayer[];

  bidHistory: BidSnapshot[];
};

export type TrickTakingPhase = {
  currentPlayerIndex: 0 | 1 | 2 | 3;
  leadPlayerIndex: 0 | 1 | 2 | 3;
  trumpSuit: BidSuit | null;

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

export type TrickTakingPhaseHidden = {
  defenderTeam: {
    playerList: GameRoomPlayer[];
    tricksWon: number;
    tricksNeeded: number;
  };
  declarerTeam: {
    playerList: GameRoomPlayer[];
    tricksWon: number;
    tricksNeeded: number;
  };
};
