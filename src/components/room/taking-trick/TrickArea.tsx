import React from "react";
import PlayingCard from "../../PlayingCard";

import { useAuth } from "../../../hooks/useAuth";
import { useRoom } from "../../../context/RoomContext";

const TrickArea: React.FC = () => {
  const { room } = useRoom();
  const { playerAccount } = useAuth();

  if (!room || !playerAccount) {
    return null;
  }

  const currentPlayerPosition = room.players.find((player) => player.id === playerAccount.id)!.position as number;

  const getCardAnimationClass = (playerPosition: number) => {
    const relativePosition = (playerPosition - currentPlayerPosition + 4) % 4;
    switch (relativePosition) {
      case 0:
        return "animate-south-card-fly-center";
      case 1:
        return "animate-east-card-fly-center";
      case 2:
        return "animate-north-card-fly-center";
      case 3:
        return "animate-west-card-fly-center";
      default:
        return "";
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-full h-full">
        {room.players.map((player) => (
          <div
            key={player.position}
            className={`relative top-1/3 left-1/2 w-[100px] h-auto transition-all duration-500 ${getCardAnimationClass(
              player.position as number
            )}`}
          >
            {player.currentCardOnTable && <PlayingCard card={player.currentCardOnTable} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrickArea;
