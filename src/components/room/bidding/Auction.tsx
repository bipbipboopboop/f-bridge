import React from "react";

import { avatarLookup } from "assets/avatar";

import { useBiddingPhase } from "../../../context/BiddingContext";
import Button from "../../buttons/button";
import { useAuth } from "../../../hooks/useAuth";

const Auction: React.FC = () => {
  const { biddingPhase } = useBiddingPhase();
  const { playerAccount } = useAuth();

  if (!biddingPhase) {
    return null; // Or display a loading state
  }

  const { currentPlayerIndex, highestBid, players } = biddingPhase;

  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-6 h-1/2 max-w-[500px] min-w-[300px] w-full rounded-md bg-teal-400 shadow-xl">
        <div className="grid-cols-4 gap-y-1 pb-2.5 grid border-b border-solid border-[#e8e8e8] justify-items-center items-center">
          {players.map((player, index) => {
            const avatar = avatarLookup[player.avatarID];
            return (
              <div
                key={player.id}
                className={`${index === currentPlayerIndex ? "border-b-4 border-orange-400 h-full py-1" : ""}`}
              >
                <div className="text-xs text-center">
                  {player.id === playerAccount?.id ? "You" : `P${player.position}`}
                </div>
                <img src={avatar} className="h-10" />
              </div>
            );
          })}
        </div>
        <div className="text-center py-5 h-1/3">Start Auction</div>

        <div className="border-t border-solid border-[#e8e8e8] pt-2.5 mt-2.5">
          <div className="mb-2.5">
            <Button size={1} theme="orange" className="py-1.5 px-3.5 border-none text-white text-xs rounded-[38px]">
              Pass
            </Button>
          </div>
          <div className="bg-black/5 border border-solid border-[#62626226] rounded-[50px] grid grid-cols-7 justify-items-center p-0 px-5 w-full overflow-hidden justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((level) => (
              <button
                key={level}
                className={`bg-transparent w-[34px] h-[34px] rounded-[34px] text-base overflow-hidden border-none ${
                  highestBid?.level === level ? "text-white bg-[#4A90E2]" : ""
                }`}
                onClick={() => console.log(`Bid ${level}`)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
