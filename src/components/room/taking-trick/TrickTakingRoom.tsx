// BiddingRoom.tsx
import React from "react";
import Chatbox from "../../chat/Chatbox";

import { RestrictedPlayerProvider } from "../../../context/RestrictedPlayerContext";

import { useAuth } from "../../../hooks/useAuth";
import MatchPeripheral from "../MatchPeripheral";

const TrickTakingRoom: React.FC = () => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;

  if (!roomId || !currentPlayerId) {
    return null;
  }

  return (
    <RestrictedPlayerProvider roomID={roomId} playerID={currentPlayerId}>
      <div className="flex w-full h-full">
        <div className="relative h-full w-3/4 pt-4">
          <MatchPeripheral />
        </div>
        <div className="h-full w-1/4 p-4">
          <Chatbox />
        </div>
      </div>
    </RestrictedPlayerProvider>
  );
};

export default TrickTakingRoom;
