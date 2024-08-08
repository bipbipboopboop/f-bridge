import React, { useState, useEffect } from "react";

import { Suit, Rank, RankValue, Card } from "types/Card";

import { useRoom } from "../../../../../context/RoomContext";
import { useAuth } from "../../../../../hooks/useAuth";
import { useFunctions } from "../../../../../hooks/useFunctions";
import { useRestrictedPlayerData } from "../../../context/RestrictedPlayerContext";
import { useScreenSize } from "../../../../../hooks/useScreenSize";

import Button from "../../../../../components/buttons/Button";
import TeammateCard from "./TeammateCard";

const TeammatePanel: React.FC = () => {
  const { room } = useRoom();
  const { playerAccount } = useAuth();
  const { chooseTeammate } = useFunctions();
  const { restrictedPlayer } = useRestrictedPlayerData();
  const { isDesktop } = useScreenSize();

  const [selectedSuit, setSelectedSuit] = useState<Suit>("♣");
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);

  useEffect(() => {
    const firstAvailableSuit = getFirstAvailableSuit();
    if (firstAvailableSuit) {
      setSelectedSuit(firstAvailableSuit);
      setSelectedRank(getHighestRank(firstAvailableSuit));
    }
  }, []);

  if (!room || !room.phase.teammateChoosingPhase) {
    return null;
  }

  const { players, phase } = room;
  const { currentPlayerIndex } = phase.teammateChoosingPhase!;
  const isBidWinner = players[currentPlayerIndex].id === playerAccount?.id;

  const handleSuitClick = (suit: Suit) => {
    if (isBidWinner) {
      setSelectedSuit(suit);
      setSelectedRank(getHighestRank(suit));
    }
  };

  const handleRankChange = (increment: boolean) => {
    if (isBidWinner && selectedRank) {
      const availableRanks = getAvailableRanks(selectedSuit);
      const currentIndex = availableRanks.indexOf(selectedRank);
      const newIndex = increment
        ? (currentIndex + 1) % availableRanks.length
        : (currentIndex - 1 + availableRanks.length) % availableRanks.length;
      setSelectedRank(availableRanks[newIndex]);
    }
  };

  const handleConfirmClick = () => {
    if (isBidWinner && selectedSuit && selectedRank) {
      const rankValue: RankValue = getRankValue(selectedRank);
      const card: Card = { suit: selectedSuit, rank: selectedRank, value: rankValue };
      chooseTeammate(card);
    }
  };

  const getRankValue = (rank: Rank): RankValue => {
    const rankValues: { [key: string]: RankValue } = {
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      "10": 10,
      J: 11,
      Q: 12,
      K: 13,
      A: 14,
    };
    return rankValues[rank];
  };

  const getAvailableRanks = (suit: Suit): Rank[] => {
    const bidWinnerCards = restrictedPlayer?.cards || [];
    const availableRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"].filter((rank) => {
      return !bidWinnerCards.some((card) => card.suit === suit && card.rank === rank);
    });
    return availableRanks as Rank[];
  };

  const getHighestRank = (suit: Suit): Rank | null => {
    const availableRanks = getAvailableRanks(suit);
    return availableRanks.length > 0 ? availableRanks[availableRanks.length - 1] : null;
  };

  const isOnlyOneRankAvailable = (suit: Suit): boolean => {
    const availableRanks = getAvailableRanks(suit);
    return availableRanks.length === 1;
  };

  const getFirstAvailableSuit = (): Suit | null => {
    const suits = ["♣", "♦", "♥", "♠"];
    for (const suit of suits) {
      const availableRanks = getAvailableRanks(suit as Suit);
      if (availableRanks.length > 0) {
        return suit as Suit;
      }
    }
    return null;
  };

  const panelStyles = isDesktop
    ? "p-6 h-[60%] w-full max-w-[500px] min-w-[300px]"
    : "p-2 h-[70%] w-[40%] max-w-[800px] min-w-[300px] relative bottom-[6%]";

  return (
    <div className="flex justify-center items-center h-full">
      <div className={`rounded-md bg-teal-400 shadow-xl ${panelStyles}`} style={{ zIndex: 1 }}>
        <div className="pb-1 md:pb-2.5 mb-1 md:mb-2.5">
          <div className="text-center">
            {isBidWinner ? "Choose A Teammate" : `P${players[currentPlayerIndex].position} is choosing a teammate`}
          </div>
        </div>
        {isBidWinner && (
          <>
            <div className="bg-black/10 rounded-md p-2 md:p-4">
              <div
                className={`bg-black/5 rounded-md grid justify-items-center py-1 px-5 mb-2 md:mb-4  ${
                  isDesktop ? "grid-cols-4" : "grid-cols-4"
                }`}
              >
                {["♣", "♦", "♥", "♠"].map((suit) => (
                  <button
                    key={suit}
                    className={`overflow-hidden ${
                      isDesktop ? "w-[44px] h-[44px] text-2xl" : "w-[30px] h-[30px] text-xl"
                    } ${selectedSuit === suit ? "border-4 border-black/50 rounded" : ""}`}
                    style={{ color: suit === "♥" || suit === "♦" ? "#FF525D" : "#222222" }}
                    onClick={() => handleSuitClick(suit as Suit)}
                  >
                    <div
                      className={`flex justify-center relative ${
                        isDesktop ? "text-4xl bottom-1" : "text-2xl bottom-0.5"
                      }`}
                    >
                      {suit}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center mb-2 md:mb-4">
                <Button
                  size={isDesktop ? 1 : 2}
                  theme="yellow"
                  className={`mr-2 ${isDesktop ? "py-1.5 px-3.5" : "py-1 px-2"}`}
                  onClick={() => handleRankChange(false)}
                  disabled={isOnlyOneRankAvailable(selectedSuit)}
                >
                  {`<`}
                </Button>
                <TeammateCard
                  suit={selectedSuit}
                  rank={selectedRank}
                  className={`${isDesktop ? "" : "w-[60px] h-[75px]"}`}
                />
                <Button
                  size={isDesktop ? 1 : 2}
                  theme="yellow"
                  className={`ml-2 ${isDesktop ? "py-1.5 px-3.5" : "py-1 px-2"}`}
                  onClick={() => handleRankChange(true)}
                  disabled={isOnlyOneRankAvailable(selectedSuit)}
                >
                  {`>`}
                </Button>
              </div>
              <div className="flex justify-center">
                <Button
                  size={isDesktop ? 1 : 2}
                  theme="orange"
                  className={`${isDesktop ? "py-1.5 px-3.5" : "py-1 px-2"}`}
                  onClick={handleConfirmClick}
                >
                  Confirm
                </Button>
              </div>
            </div>
            <div className="mt-0 md:mt-4 text-3xs md:text-sm text-center">
              Pick a card by selecting a suit and its rank, whoever has this card will be your teammate.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeammatePanel;
