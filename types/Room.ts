import { PublicBiddingPhase, PublicEndedPhase, PublicTeammateChoosingPhase, PublicTrickTakingPhase } from "./GameState";
import { PublicPlayer } from "./Player";

// Global
export type GameRoom = {
  roomID: string;
  hostID: string;
  createdAt: Date;
  settings: GameRoomSettings;
  status: "Waiting" | "Bidding" | "Choosing Teammate" | "Taking Trick" | "Ended";
  invitedPlayerIDs: string[];
  playerCount: number;
  players: PublicPlayer[];
  phase: {
    biddingPhase: PublicBiddingPhase | null;
    teammateChoosingPhase: PublicTeammateChoosingPhase | null;
    trickTakingPhase: PublicTrickTakingPhase | null;
    endedPhase: PublicEndedPhase | null;
  };
};

export type GameRoomSettings = {
  isInviteOnly: boolean;
  isSpectatorAllowed: boolean;
};
