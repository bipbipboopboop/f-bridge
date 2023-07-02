// types/GameState.ts
import { Bid, BidSuit } from "types/Bid";
import { GamePlayer, GameRoomPlayer, LobbyPlayerProfile } from "./PlayerProfile";

export type GameState = {
  roomID: string;
  hostID: string;
  createdAt: Date;
  settings: GameRoomSettings;
  invitedID: string[];

  status: "Waiting" | "Bidding" | "Choosing Teammate" | "Taking Trick" | "Ended";
  players: LobbyPlayerProfile[];

  biddingPhase: BiddingPhase | null;
  trickTakingPhase: TrickTakingPhase | null;
  endedPhase: EndedPhase | null;
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

  numPasses: number;

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
    playerList: GamePlayer[]; // TODO: Change
    tricksWon: number;
    tricksNeeded: number;
  };
  declarerTeam: {
    playerList: GamePlayer[]; // TODO: Change
    tricksWon: number;
    tricksNeeded: number;
  };
};

export type EndedPhase = {
  winnerTeam: {
    playerList: GamePlayer[]; // TODO: Change
  };
};
