// import { useState } from "react";
// import { useRoom } from "../../../context/RoomContext";
// import { useBiddingPhase } from "../../../context/BiddingContext";
// import { RestrictedPlayerData } from "types/Player";
// import PlayingCard from "../../PlayingCard";
// import Button from "../../buttons/button";

import { useState } from "react";
import { useRoom } from "../../context/RoomContext";
import { useBiddingPhase } from "../../context/BiddingContext";
import { RestrictedPlayerData } from "types/GameState";
import PlayingCard from "../PlayingCard";
import Button from "../buttons/button";

interface PlayerHandProps {
  position: number;
  restrictedPlayer: RestrictedPlayerData;
}

interface PlayerHandProps {
  position: number;
  restrictedPlayer: RestrictedPlayerData;
  isCurrentPlayer: boolean;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ position, restrictedPlayer, isCurrentPlayer }) => {
  const { room } = useRoom();
  const { biddingPhase } = useBiddingPhase();
  // const { trickTakingPhase } = useTrickTakingPhase();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  if (!room || !biddingPhase) {
    return null;
  }

  const isBiddingPhase = room.status === "Bidding";
  const isTrickTakingPhase = room.status === "Taking Trick";

  const handleCardClick = (index: number) => {
    if (isTrickTakingPhase && isCurrentPlayer) {
      setSelectedCard(index);
    }
  };

  const handlePlayClick = () => {
    if (selectedCard !== null && isCurrentPlayer) {
      // Perform the play action with the selected card
      console.log("Playing card:", restrictedPlayer.cards[selectedCard]);
      setSelectedCard(null);
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <div className="flex justify-center -space-x-[12%]">
        {restrictedPlayer.cards.map((card, index) => (
          <div
            key={index}
            className={`cursor-pointer transition-transform duration-300 ease-in-out ${
              isTrickTakingPhase && isCurrentPlayer ? "hover:transform hover:-translate-y-8" : ""
            }`}
            onClick={() => handleCardClick(index)}
          >
            <PlayingCard
              card={card}
              style={{ zIndex: 40 - index * 2 }}
              className={selectedCard === index ? "transform -translate-y-8" : ""}
            />
          </div>
        ))}
      </div>
      {isTrickTakingPhase && isCurrentPlayer && selectedCard !== null && (
        <div className="absolute right-0 bottom-0 mb-2">
          <Button size={1} theme="green" onClick={handlePlayClick}>
            Play
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlayerHand;
