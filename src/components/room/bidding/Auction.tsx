import React from "react";

import { useBiddingPhase } from "../../../context/BiddingContext";
import Button from "../../buttons/button";

import AuctionAvatarRow from "./AuctionAvatarRow";

const Auction: React.FC = () => {
  const { biddingPhase } = useBiddingPhase();

  if (!biddingPhase) {
    return null; // Or display a loading state
  }

  const { highestBid } = biddingPhase;

  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-6 h-[55%] w-full max-w-[500px] min-w-[300px] rounded-md bg-teal-400 shadow-xl">
        <div className="h-1/5 pb-2.5 mb-2.5">
          <AuctionAvatarRow />
        </div>

        <div className="h-2/5 mb-2.5 border-y-2 border-[#e8e8e8]">
          <div className="pt-5 text-center">Start Auction</div>
        </div>

        <div className="3/5">
          <Button size={1} theme="orange" className="py-1.5 px-3.5 mb-2.5  text-white text-xs">
            Pass
          </Button>
          <div className="bg-black/5 border border-[#62626226] rounded-md grid grid-cols-7 justify-items-center p-0 px-5 w-full overflow-hidden justify-between">
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
