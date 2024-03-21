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

  const southPlayerPosition = room.players.find((player) => player.id === playerAccount.id)!.position as number;
  const westPlayerPosition = (southPlayerPosition + 3) % 4;
  const northPlayerPosition = (southPlayerPosition + 2) % 4;
  const eastPlayerPosition = (southPlayerPosition + 1) % 4;

  const getCardAnimationClass = (playerPosition: number) => {
    switch (playerPosition) {
      case southPlayerPosition:
        return "animate-south-card-fly-center south-card";
      case westPlayerPosition:
        return "animate-west-card-fly-center west-card";
      case northPlayerPosition:
        return "animate-north-card-fly-center north-card";
      case eastPlayerPosition:
        return "animate-east-card-fly-center east-card";
      default:
        return "";
    }
  };

  const getCardFinalPosition = (playerPosition: number) => {
    switch (playerPosition) {
      case southPlayerPosition:
        return "bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/4";
      case westPlayerPosition:
        return "top-1/2 left-1/3 transform -translate-y-1/2 translate-x-1/4";
      case northPlayerPosition:
        return "top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/4";
      case eastPlayerPosition:
        return "top-1/2 right-1/3 transform -translate-y-1/2 -translate-x-1/4";
      default:
        return "";
    }
  };

  return (
    <div className="relative w-full h-full">
      {room.players.map((player) => {
        console.log({ player: player.position, southPlayerPosition });
        return (
          player.currentCardOnTable && (
            <PlayingCard
              card={player.currentCardOnTable}
              className={`absolute transition-all duration-500 ${getCardAnimationClass(
                player.position as number
              )} ${getCardFinalPosition(player.position as number)}`}
            />
          )
        );
      })}
    </div>
  );
};

export default TrickArea;
