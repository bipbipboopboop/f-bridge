// BiddingRoom.tsx
import React from "react";
import Chatbox from "../../chat/Chatbox";
import Auction from "./Auction";

import { GameStateProvider } from "../../../context/GameStateContext";
import { RestrictedPlayerProvider } from "../../../context/RestrictedPlayerContext";

import { useAuth } from "../../../hooks/useAuth";
import MatchPeripheral from "../MatchPeripheral";

const BiddingRoom: React.FC = () => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;

  if (!roomId || !currentPlayerId) {
    return null;
  }

  return (
    <RestrictedPlayerProvider roomID={roomId} playerID={currentPlayerId}>
      <GameStateProvider roomID={roomId}>
        <div className="flex w-full h-full">
          <div className="relative h-full w-3/4 pt-4">
            <Auction />
            <MatchPeripheral />
          </div>
          <div className="h-full w-1/4 p-4">
            <Chatbox />
          </div>
        </div>
      </GameStateProvider>
    </RestrictedPlayerProvider>
  );
};

export default BiddingRoom;
