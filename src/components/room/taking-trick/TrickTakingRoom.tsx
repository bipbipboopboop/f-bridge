// BiddingRoom.tsx
import React from "react";
import Chatbox from "../../chat/Chatbox";

import { RestrictedPlayerProvider } from "../../../context/RestrictedPlayerContext";

import { useAuth } from "../../../hooks/useAuth";
import MatchPeripheral from "../MatchPeripheral";
import TrickArea from "./TrickArea";
import TrickMonitor from "./TrickMonitor";

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
          <TrickArea />
          <MatchPeripheral />
        </div>
        <div className="h-full w-1/4 p-4 flex flex-col">
          <div className="h-2/5">
            <TrickMonitor />
          </div>
          <div className="h-3/5">
            <Chatbox />
          </div>
        </div>
      </div>
    </RestrictedPlayerProvider>
  );
};

export default TrickTakingRoom;
