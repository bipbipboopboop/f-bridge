import Button from "../../buttons/button";
import { useGameState } from "../../../context/GameStateContext";
import { BidLevel, BidSuit } from "types/Bid";
import { useAuth } from "../../../hooks/useAuth";
import { useFunctions } from "../../../hooks/useFunctions";
import { useState } from "react";

const AuctionButtons = () => {
  const { biddingPhase } = useGameState();
  const { playerAccount } = useAuth();
  const { placeBid } = useFunctions();

  const [selectedNumber, setSelectedNumber] = useState<BidLevel | null>(null);
  const [selectedSuit, setSelectedSuit] = useState<BidSuit | null>(null);

  if (!biddingPhase) {
    return null;
  }

  const { highestBid, currentPlayerIndex, players } = biddingPhase;
  const isYourTurn = players[currentPlayerIndex].id === playerAccount?.id;

  const handleNumberClick = (level: BidLevel) => {
    if (isYourTurn) {
      setSelectedNumber(level);
      setSelectedSuit(null);
    }
  };

  const handleBidSuitClick = (suit: BidSuit) => {
    if (isYourTurn && selectedNumber) {
      setSelectedSuit(suit);
    }
  };

  const handlePassClick = () => {
    if (isYourTurn) {
      placeBid({ level: 1, suit: "Pass" });
    }
  };

  const handleConfirmClick = () => {
    if (isYourTurn && selectedNumber && selectedSuit) {
      placeBid({ level: selectedNumber, suit: selectedSuit });
      setSelectedNumber(null);
      setSelectedSuit(null);
    }
  };

  if (!isYourTurn) return null;

  return (
    <div>
      <div className="flex mb-2.5 space-x-2">
        <Button size={1} theme="orange" className="py-1.5 px-3.5 text-white text-xs" onClick={handlePassClick}>
          Pass
        </Button>
        {selectedNumber && selectedSuit && (
          <Button size={1} theme="yellow" className="py-1.5 px-3.5 text-xs" onClick={handleConfirmClick}>
            Confirm
          </Button>
        )}
      </div>
      <div className="bg-black/5 border border-[#62626226] rounded-md grid grid-cols-7 justify-items-center py-1 px-5">
        {[1, 2, 3, 4, 5, 6, 7].map((level) => (
          <button
            key={level}
            className={`w-[34px] h-[34px] rounded-[5px] text-base overflow-hidden border-none ${
              highestBid?.level === level ? "text-white bg-[#4A90E2]" : ""
            } ${selectedNumber === level ? "bg-black/20 text-white" : ""}`}
            onClick={() => handleNumberClick(level as BidLevel)}
          >
            <div className="flex justify-center relative top-1">{level}</div>
          </button>
        ))}
      </div>
      {selectedNumber && (
        <div className="bg-black/5 border border-[#62626226] rounded-md grid grid-cols-7 justify-items-center py-1 px-5 mt-2.5">
          {["♣", "♦", "♥", "♠", "NT"].map((suit) => {
            const isRedSuit = suit === "♥" || suit === "♦";
            return (
              <button
                key={suit}
                className={`w-[34px] h-[34px] text-2xl overflow-hidden border-none ${
                  selectedSuit === suit ? "bg-black/25 text-white rounded" : ""
                }`}
                style={{ color: isRedSuit ? "#FF525D" : "#222222" }}
                onClick={() => handleBidSuitClick(suit as BidSuit)}
              >
                <div
                  className={`flex justify-center relative ${suit === "NT" ? "text-sm top-1" : "text-4xl bottom-1"}`}
                >
                  {suit}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuctionButtons;
