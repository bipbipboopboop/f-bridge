import React, { useState, useEffect } from "react";
import { useRoom } from "../../../context/RoomContext";
import { useAuth } from "../../../hooks/useAuth";
import { useFunctions } from "../../../hooks/useFunctions";
import { useRestrictedPlayerData } from "../../../context/RestrictedPlayerContext";
import { Suit, Rank, RankValue, Card } from "types/Card";
import Button from "../../buttons/button";
import TeammateCard from "./TeammateCard";

const TeammatePanel: React.FC = () => {
  const { room } = useRoom();
  const { playerAccount } = useAuth();
  const { chooseTeammate } = useFunctions();
  const { restrictedPlayer } = useRestrictedPlayerData();
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
      setSelectedSuit("♣");
      setSelectedRank(null);
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

  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-6 h-[60%] w-full max-w-[500px] min-w-[300px] rounded-md bg-teal-400 shadow-xl">
        <div className="pb-2.5 mb-2.5">
          <div className="text-center">
            {isBidWinner ? "Choose A Teammate" : `P${players[currentPlayerIndex].position} is chosing a teammate`}
          </div>
        </div>
        {isBidWinner && (
          <>
            <div className="bg-black/10 rounded-md p-4">
              <div className="bg-black/5 rounded-md grid grid-cols-4 justify-items-center py-1 px-5 mb-4">
                {["♣", "♦", "♥", "♠"].map((suit) => (
                  <button
                    key={suit}
                    className={`w-[44px] h-[44px] text-2xl overflow-hidden ${
                      selectedSuit === suit ? "border-4 border-black/50 rounded" : ""
                    }`}
                    style={{ color: suit === "♥" || suit === "♦" ? "#FF525D" : "#222222" }}
                    onClick={() => handleSuitClick(suit as Suit)}
                  >
                    <div className="flex justify-center relative text-4xl bottom-1">{suit}</div>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center mb-4">
                <Button
                  size={1}
                  theme="yellow"
                  className="py-1.5 px-3.5 mr-2"
                  onClick={() => handleRankChange(false)}
                  disabled={isOnlyOneRankAvailable(selectedSuit)}
                >
                  {`<`}
                </Button>
                <TeammateCard suit={selectedSuit} rank={selectedRank} />
                <Button
                  size={1}
                  theme="yellow"
                  className="py-1.5 px-3.5 ml-2"
                  onClick={() => handleRankChange(true)}
                  disabled={isOnlyOneRankAvailable(selectedSuit)}
                >
                  {`>`}
                </Button>
              </div>
              <div className="flex justify-center">
                <Button size={1} theme="orange" className="py-1.5 px-3.5" onClick={handleConfirmClick}>
                  Confirm
                </Button>
              </div>
            </div>
            <div className="mt-4 text-sm text-center">
              Pick a card by selecting a suit and its rank, whoever has this card will be your teammate.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeammatePanel;
