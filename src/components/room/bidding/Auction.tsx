import React from "react";

import AuctionAvatarRow from "./AuctionAvatarRow";
import AuctionButtons from "./AuctionButtons";
import AuctionDashboard from "./AuctionDashboard";

const Auction: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-6 h-[60%] w-full max-w-[500px] min-w-[300px] rounded-md bg-teal-400 shadow-xl">
        <div className="h-1/5 pb-2.5 mb-2.5">
          <AuctionAvatarRow />
        </div>

        <div className="h-2/5 mb-2.5 border-y-2 border-[#e8e8e8]">
          <AuctionDashboard />
        </div>

        <div className="h-3/5">
          <AuctionButtons />
        </div>
      </div>
    </div>
  );
};

export default Auction;
