import React from "react";

import BiddingAvatarRow from "./BiddingAvatarRow";
import BiddingButtonPanel from "./BiddingButtonPanel";
import BiddingDashboard from "./BiddingDashboard";

const BiddingPanel: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className="rounded-md bg-teal-400 shadow-xl px-2 h-[70%] w-[40%] max-w-[800px] min-w-[300px] relative bottom-5"
        style={{ zIndex: 1 }}
      >
        <div className="h-[15%] mb-1 py-1">
          <BiddingAvatarRow />
        </div>
        <div className="h-[33.5%] mb-2 border-y-2 border-[#e8e8e8]">
          <BiddingDashboard />
        </div>
        <div className="h-[51.5%]">
          <BiddingButtonPanel />
        </div>
      </div>
    </div>
  );
};

export default BiddingPanel;
