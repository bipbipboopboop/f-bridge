// BiddingRoom.tsx
import React from "react";
import Chatbox from "../../chat/Chatbox";
import { Auction, Hands } from "./Auction";
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
        <div className="flex w-full h-full px-10">
          <div className="relative h-full w-2/3 pt-4">
            <Auction />
            <Hands />
          </div>
          <div className="h-full w-1/3 p-4">
            <Chatbox />
          </div>
        </div>
      </BiddingProvider>
    </RestrictedPlayerProvider>
  );
};

export default BiddingRoom;
