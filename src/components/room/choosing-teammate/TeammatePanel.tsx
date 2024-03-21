import React, { useState } from "react";
import { useRoom } from "../../../context/RoomContext";
import { useAuth } from "../../../hooks/useAuth";
import { useFunctions } from "../../../hooks/useFunctions";
import { Suit } from "types/Card";
import Button from "../../buttons/button";

const TeammatePanel: React.FC = () => {
  const { room } = useRoom();
  const { playerAccount } = useAuth();
  const { chooseTeammate } = useFunctions();
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const [selectedRank, setSelectedRank] = useState<string | null>(null);

  if (!room || !room.phase.teammateChoosingPhase) {
    return null;
  }

  const { players, phase } = room;
  const { currentPlayerIndex, highestBid } = phase.teammateChoosingPhase!;
  const isBidWinner = players[currentPlayerIndex].id === playerAccount?.id;

  const handleSuitClick = (suit: Suit) => {
    if (isBidWinner) {
      setSelectedSuit(suit);
    }
  };

  const handleRankClick = (rank: string) => {
    if (isBidWinner && selectedSuit) {
      setSelectedRank(rank);
    }
  };

  // const handleConfirmClick = () => {
  //   if (isBidWinner && selectedSuit && selectedRank) {
  //     chooseTeammate({ suit: selectedSuit, rank: selectedRank });
  //     setSelectedSuit(null);
  //     setSelectedRank(null);
  //   }
  // };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-6 h-[60%] w-full max-w-[500px] min-w-[300px] rounded-md bg-teal-400 shadow-xl">
        <div className="h-1/5 pb-2.5 mb-2.5">
          <div className="text-center">
            {isBidWinner ? "Choose a Teammate" : `${players[currentPlayerIndex].displayName} is choosing`}
          </div>
        </div>
        {isBidWinner && (
          <>
            <div className="h-2/5 mb-2.5">
              <div className="bg-black/5 border border-[#62626226] rounded-md grid grid-cols-7 justify-items-center py-1 px-5">
                {["♠", "♣", "♥", "♦"].map((suit) => (
                  <button
                    key={suit}
                    className={`w-[34px] h-[34px] text-2xl overflow-hidden border-none ${
                      selectedSuit === suit ? "bg-black/25 text-white rounded" : ""
                    }`}
                    style={{ color: suit === "♥" || suit === "♦" ? "#FF525D" : "#222222" }}
                    onClick={() => handleSuitClick(suit as Suit)}
                  >
                    <div className="flex justify-center relative text-4xl bottom-1">{suit}</div>
                  </button>
                ))}
              </div>
            </div>
            {selectedSuit && (
              <div className="h-3/5">
                <div className="bg-black/5 border border-[#62626226] rounded-md grid grid-cols-7 justify-items-center py-1 px-5">
                  {["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"].map((rank) => (
                    <button
                      key={rank}
                      className={`w-[34px] h-[34px] text-base overflow-hidden border-none ${
                        selectedRank === rank ? "bg-black/25 text-white rounded" : ""
                      }`}
                      onClick={() => handleRankClick(rank)}
                    >
                      <div className="flex justify-center relative top-1">{rank}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    size={1}
                    theme="yellow"
                    className="py-1.5 px-3.5"
                    //  onClick={handleConfirmClick}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeammatePanel;
