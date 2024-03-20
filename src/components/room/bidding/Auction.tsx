import React from "react";

import { avatarLookup } from "assets/avatar";

import { useBiddingPhase } from "../../../context/BiddingContext";

const Auction: React.FC = () => {
  const { biddingPhase } = useBiddingPhase();

  if (!biddingPhase) {
    return null; // Or display a loading state
  }

  const { currentPlayerIndex, numPasses, highestBid, bidHistory, players } = biddingPhase;

  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-6 max-w-[500px] min-w-[300px] w-full rounded-md bg-orange-400 shadow-xl">
        <div className="grid-cols-4 gap-y-1 pb-2.5 grid border-b border-solid border-[#e8e8e8] justify-items-center items-center">
          {players.map((player, index) => {
            const avatar = avatarLookup[player.avatarID];
            return (
              <div
                key={player.id}
                className={`${index === currentPlayerIndex ? "border-2 border-solid border-[#e4e0d8]" : ""}`}
              >
                <img src={avatar} />
              </div>
            );
          })}
        </div>
        <div className="text-center py-5">Start Auction</div>
        <div className="border-t border-solid border-[#e8e8e8] pt-2.5 mt-2.5">
          <div className="mb-2.5">
            <button className="w-4/5 py-1.5 px-3.5 border-none text-white text-xs rounded-[38px] bg-[#4A90E2]">
              Pass
            </button>
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
