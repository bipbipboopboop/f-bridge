import { useState } from "react";
import _ from "lodash";

import { useRoom } from "../../context/RoomContext";
import { useRestrictedPlayerData } from "../../context/RestrictedPlayerContext";

import { Card } from "types/Card";

import PlayingCard from "../PlayingCard";
import Button from "../buttons/button";

const PlayerHand = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [sortMode, setSortMode] = useState<"default" | "suit" | "rank">("default");

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
      console.log("Playing card:", restrictedPlayer?.cards[selectedCard]);
      setSelectedCard(null);
    }
  };

  const sortCards = (cards: Card[]) => {
    switch (sortMode) {
      case "default":
        return cards;
      case "suit":
        return _.chain(cards)
          .groupBy("suit")
          .map((group) => _.sortBy(group, (card) => card.value).reverse())
          .flatten()
          .value();
      case "rank":
        return _.sortBy(cards, (card) => card.value);
      default:
        return cards;
    }
  };

  const handleSortClick = () => {
    switch (sortMode) {
      case "default":
        setSortMode("suit");
        break;
      case "suit":
        setSortMode("rank");
        break;
      case "rank":
        setSortMode("default");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center -space-x-[12%]">
          {sortCards(restrictedPlayer?.cards || []).map((card, index) => (
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
      <div className="w-1/12 flex flex-col absolute right-5 bottom-4 gap-y-2">
        {isTrickTakingPhase && isCurrentPlayer && selectedCard !== null && (
          <Button size={1} theme="orange" onClick={handlePlayClick}>
            Play
          </Button>
        )}

        <Button size={1} theme="yellow" onClick={handleSortClick}>
          Sort
        </Button>
      </div>
    </>
  );
};

export default PlayerHand;
