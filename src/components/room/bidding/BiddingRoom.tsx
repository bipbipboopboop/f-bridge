// BiddingRoom.tsx
import React from "react";
import Chatbox from "../../chat/Chatbox";
import Auction from "./Auction";
import MatchPeripheral from "../MatchPeripheral";
import { BiddingProvider } from "../../../context/BiddingContext";
import { RestrictedPlayerProvider } from "../../../context/RestrictedPlayerContext";

import { useAuth } from "../../../hooks/useAuth";

const BiddingRoom: React.FC = () => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;

  if (!roomId || !currentPlayerId) {
    return null; // Or display a loading state or error message
  }

  return (
    <RestrictedPlayerProvider roomID={roomId} playerID={currentPlayerId}>
      <BiddingProvider roomID={roomId}>
        <div className="flex w-full h-full">
          <div className="relative h-full w-3/4 pt-4">
            <Auction />
            <MatchPeripheral />
          </div>
          <div className="h-full w-1/4 p-4">
            <Chatbox />
          </div>
        </div>
      </BiddingProvider>
    </RestrictedPlayerProvider>
  );
};

export default BiddingRoom;
