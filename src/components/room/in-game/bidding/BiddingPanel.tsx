import React from "react";
import { useScreenSize } from "../../../../hooks/useScreenSize";

import BiddingAvatarRow from "./BiddingAvatarRow";
import BiddingButtonPanel from "./BiddingButtonPanel";
import BiddingDashboard from "./BiddingDashboard";

const BiddingPanel: React.FC = () => {
  const { isDesktop } = useScreenSize();

  const landscapeStyles = "p-2 h-[70%] w-[40%] max-w-[800px] min-w-[300px] relative bottom-[6%]";

  return (
    <div className="flex justify-center items-center h-full">
      <div
        className={`rounded-md bg-teal-400 shadow-xl ${
          isDesktop ? "p-6 h-[60%] w-full max-w-[500px] min-w-[300px]" : landscapeStyles
        }`}
        style={{ zIndex: 1 }}
      >
        <div className="h-1/6 pb-2.5 mb-2.5 mobile-landscape:mb-1 mobile-landscape:pb-1 mobile-landscape:h-1/6">
          <BiddingAvatarRow />
        </div>
        <div className="h-2/6 mb-2.5 border-y-2 border-[#e8e8e8] mobile-landscape:h-2/6">
          <BiddingDashboard />
        </div>
        <div className="h-3/6">
          <BiddingButtonPanel />
        </div>
      </div>
    </div>
  );
};

export default BiddingPanel;
