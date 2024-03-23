import { useState } from "react";
import _ from "lodash";
import { useRoom } from "../../context/RoomContext";
import { useRestrictedPlayerData } from "../../context/RestrictedPlayerContext";
import { Card } from "types/Card";
import { useFunctions } from "../../hooks/useFunctions";

import PlayingCard from "../PlayingCard";
import Button from "../buttons/button";

const PlayerHand = () => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  // Start sorting by suit by default
  const [sortMode, setSortMode] = useState<"suit" | "rank">("suit");
  const { restrictedPlayer } = useRestrictedPlayerData();
  const { room } = useRoom();
  const { playCard } = useFunctions();

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

  const handleCardClick = (card: Card) => {
    if (isTrickTakingPhase && isCurrentPlayer) {
      setSelectedCard(card);
    }
  };

  const handlePlayClick = () => {
    if (selectedCard && isCurrentPlayer) {
      console.log("Playing card:", selectedCard);
      playCard(selectedCard);
      setSelectedCard(null);
    }
  };

  const sortCards = (cards: Card[]) => {
    switch (sortMode) {
      case "suit":
        // Sorting by suit, then by rank within each suit
        return _.chain(cards)
          .groupBy("suit")
          .map((group) => _.sortBy(group, ["value"]))
          .flatten()
          .value();
      case "rank":
        // Directly sorting by rank
        return _.sortBy(cards, ["value"]);
      default:
        // Should not reach here as we've removed 'default', but just in case
        return cards;
    }
  };

  const handleSortClick = () => {
    // Toggle between sort modes
    setSortMode(sortMode === "suit" ? "rank" : "suit");
  };

  const canPlayCard = isTrickTakingPhase && isCurrentPlayer;

  return (
    <>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center -space-x-12 mobile-landscape:-space-x-6">
          {sortCards(restrictedPlayer?.cards || []).map((card, index) => (
            <PlayingCard
              key={index}
              card={card}
              style={{ zIndex: index + 1 }}
              className={`cursor-pointer transition-transform duration-300 ease-in-out hover:transform hover:-translate-y-8 ${
                selectedCard?.suit === card.suit && selectedCard?.rank === card.rank ? "transform -translate-y-8" : ""
              }`}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      </div>
      <div className="w-[13%] flex flex-col absolute right-5 bottom-4 gap-y-2">
        <Button
          size={1}
          theme="green"
          className={!canPlayCard ? "opacity-0" : selectedCard ? "opacity-100" : "opacity-50"}
          onClick={handlePlayClick}
          disabled={!canPlayCard && !selectedCard}
        >
          Play
        </Button>
        <Button size={1} theme="orange" onClick={handleSortClick}>
          Sort
        </Button>
      </div>
    </>
  );
};

export default PlayerHand;
