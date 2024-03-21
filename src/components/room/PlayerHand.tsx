import { useState } from "react";
import { useRoom } from "../../context/RoomContext";
import PlayingCard from "../PlayingCard";
import Button from "../buttons/button";
import { useRestrictedPlayerData } from "../../context/RestrictedPlayerContext";

const PlayerHand = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const { restrictedPlayer } = useRestrictedPlayerData();
  const { room } = useRoom();

  if (!room) {
    return null;
  }

  const isBiddingPhase = room.status === "Bidding";
  const isTeammateChoosingPhase = room.status === "Choosing Teammate";
  const isTrickTakingPhase = room.status === "Taking Trick";

  const phase = isBiddingPhase
    ? room.phase.biddingPhase
    : isTeammateChoosingPhase
    ? room.phase.teammateChoosingPhase
    : isTrickTakingPhase
    ? room.phase.trickTakingPhase
    : null;

  const southPlayer = room.players.find((player) => player.id === restrictedPlayer?.id)!;
  const isCurrentPlayer = southPlayer.position === phase?.currentPlayerIndex;

  const handleCardClick = (index: number) => {
    if (isTrickTakingPhase && isCurrentPlayer) {
      setSelectedCard(index);
    }
  };

  const handlePlayClick = () => {
    if (selectedCard !== null && isCurrentPlayer) {
      // Perform the play action with the selected card
      console.log("Playing card:", restrictedPlayer?.cards[selectedCard]);
      setSelectedCard(null);
    }
  };
  return (
    <>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center -space-x-[12%]">
          {restrictedPlayer?.cards.map((card, index) => (
            <PlayingCard
              key={index}
              card={card}
              style={{ zIndex: 40 - index * 2 }}
              className={`cursor-pointer transition-transform duration-300 ease-in-out hover:transform hover:-translate-y-8 ${
                selectedCard === index ? "transform -translate-y-8" : ""
              }`}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>
      </div>
      {isTrickTakingPhase && isCurrentPlayer && selectedCard !== null && (
        <div className="absolute right-5 bottom-5">
          <Button size={2} theme="green" onClick={handlePlayClick}>
            Play
          </Button>
        </div>
      )}
    </>
  );
};

export default PlayerHand;
