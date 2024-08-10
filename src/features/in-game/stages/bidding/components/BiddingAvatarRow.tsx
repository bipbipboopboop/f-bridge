import React from "react";
import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../../../../hooks/useAuth";
import { useRoom } from "../../../../../context/RoomContext";

const DIRECTIONS = ["South", "East", "North", "West"];

const AuctionAvatarRow: React.FC = () => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();

  if (!room?.phase.biddingPhase || !playerAccount) {
    return null;
  }

  const { players } = room;
  const { currentPlayerIndex } = room.phase.biddingPhase;

  const getPlayerDirection = (playerIndex: number): string => {
    const currentPlayerPosition = players.findIndex((player) => player.id === playerAccount.id);
    const relativePosition = (playerIndex - currentPlayerPosition + 4) % 4;
    return DIRECTIONS[relativePosition];
  };

  return (
    <div className="grid grid-cols-4 gap-y-1 justify-items-center items-center select-none h-full text-2xs md:text-xs">
      {players.map((player, index) => {
        const avatar = avatarLookup[player.avatarID];
        const direction = getPlayerDirection(index);
        const isCurrentPlayer = index === currentPlayerIndex;

        return (
          <div
            key={player.id}
            className={`h-full flex flex-col justify-end ${
              isCurrentPlayer ? "border-b-2 md:border-b-4 border-orange-400" : ""
            }`}
          >
            <div className="text-center select-none">
              {player.id === playerAccount.id ? "You" : `P${player.position}`}
            </div>
            <img
              src={avatar}
              className="h-4 md:h-10 max-h-4 md:max-h-10 relative bottom-1"
              alt={`${direction} player avatar`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AuctionAvatarRow;
