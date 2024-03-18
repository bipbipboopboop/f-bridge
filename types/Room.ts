// Global
export type GameRoom = {
  roomID: string;
  hostID: string;
  createdAt: Date;
  settings: GameRoomSettings;
  status: "Waiting" | "Bidding" | "Choosing Teammate" | "Taking Trick" | "Ended";
  playerCount: number;
};

export type GameRoomSettings = {
  isInviteOnly: boolean;
  isSpectatorAllowed: boolean;
};
