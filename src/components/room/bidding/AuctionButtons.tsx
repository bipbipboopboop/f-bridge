import Button from "../../buttons/button";
import { BidLevel, BidSuit } from "types/Bid";
import { useAuth } from "../../../hooks/useAuth";
import { useFunctions } from "../../../hooks/useFunctions";
import { useState } from "react";
import { useRoom } from "../../../context/RoomContext";

const AuctionButtons = () => {
  const { playerAccount } = useAuth();
  const { placeBid } = useFunctions();
  const [selectedNumber, setSelectedNumber] = useState<BidLevel | null>(null);
  const [selectedSuit, setSelectedSuit] = useState<BidSuit | null>(null);
  const { room } = useRoom();

  if (!room || !room.phase.biddingPhase) {
    return null;
  }

  const { players } = room;
  const { highestBid, currentPlayerIndex } = room.phase.biddingPhase;
  const isYourTurn = players[currentPlayerIndex].id === playerAccount?.id;

  const handleNumberClick = (level: BidLevel) => {
    if (isYourTurn && isNumberSelectable(level)) {
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

  const isNumberSelectable = (level: BidLevel) => {
    if (!highestBid) return true;
    const isHighestPossibleBid = highestBid.level === 6 && highestBid.suit === "NT";
    const isHighestBidNoTrumpOfSameLevel = highestBid.level === level && highestBid.suit === "NT";
    if (isHighestPossibleBid || isHighestBidNoTrumpOfSameLevel) return false;
    return level >= highestBid.level;
  };

  const isSuitSelectable = (suit: BidSuit) => {
    if (!selectedNumber || !highestBid) return true;
    if (highestBid.level === 6 && highestBid.suit === "NT") return false;
    if (selectedNumber > highestBid.level) return true;
    if (selectedNumber === highestBid.level) {
      const suitOrder: BidSuit[] = ["♣", "♦", "♥", "♠", "NT"];
      return suitOrder.indexOf(suit) > suitOrder.indexOf(highestBid.suit);
    }
    return false;
  };

  if (!isYourTurn) return null;

  return (
    <div>
      <div className="flex mb-2.5 space-x-2">
        <Button
          size={1}
          theme="orange"
          className="py-1.5 px-3.5 text-white text-xs mobile-landscape:h-6 mobile-landscape:text-3xs"
          onClick={handlePassClick}
        >
          Pass
        </Button>
        {selectedNumber && selectedSuit && (
          <Button
            size={1}
            theme="yellow"
            className="py-1.5 px-3.5 text-xs mobile-landscape:h-6 mobile-landscape:text-3xs"
            onClick={handleConfirmClick}
          >
            Confirm
          </Button>
        )}
      </div>
      <div className="bg-black/5 border border-[#62626226] rounded-md grid grid-cols-6 justify-items-center py-1 px-5">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            key={level}
            className={`w-[34px] h-[34px] rounded-[5px] text-base overflow-hidden border-none 
            mobile-landscape:text-2xs mobile-landscape:h-[18px] mobile-landscape:w-[18px]
             ${selectedNumber === level ? "bg-black/20 text-white" : ""} ${
              !isNumberSelectable(level as BidLevel) ? "text-gray-400 cursor-not-allowed" : ""
            }`}
            onClick={() => handleNumberClick(level as BidLevel)}
            disabled={!isNumberSelectable(level as BidLevel)}
          >
            <div className="flex justify-center relative top-1 mobile-landscape:top-0">{level}</div>
          </button>
        ))}
      </div>
      {selectedNumber && (
        <div className="bg-black/5 border border-[#62626226] rounded-md grid grid-cols-6 justify-items-center py-1 px-5 mt-2.5">
          {["♣", "♦", "♥", "♠", "NT"].map((suit) => {
            const isRedSuit = suit === "♥" || suit === "♦";
            const isNT = suit === "NT";
            const suitSelectable = isSuitSelectable(suit as BidSuit);

            const buttonClassName = `
      w-[34px] h-[34px] text-2xl overflow-hidden border-none
      mobile-landscape:text-2xs mobile-landscape:h-[18px] mobile-landscape:w-[18px]
      ${selectedSuit === suit ? "bg-black/25 rounded" : ""}
      ${suitSelectable ? "" : "text-gray-400 cursor-not-allowed opacity-50"}
      ${isRedSuit ? "text-[#FF525D]" : "text-[#222222]"}
    `;

            return (
              <button
                key={suit}
                className={buttonClassName}
                onClick={() => handleBidSuitClick(suit as BidSuit)}
                disabled={!suitSelectable}
              >
                <div
                  className={`flex justify-center relative ${
                    isNT
                      ? "text-sm top-1 text-yellow-300 mobile-landscape:text-2xs mobile-landscape:top-0.5"
                      : "text-4xl bottom-1 mobile-landscape:text-sm mobile-landscape:bottom-0.5"
                  }`}
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
