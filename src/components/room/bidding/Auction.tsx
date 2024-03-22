import React from "react";

import AuctionAvatarRow from "./AuctionAvatarRow";
import AuctionButtons from "./AuctionButtons";
import AuctionDashboard from "./AuctionDashboard";
import { useMediaQuery } from "react-responsive";

const Auction: React.FC = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const isLandscape = useMediaQuery({ orientation: "landscape" }) && !isDesktop;
  const isPortrait = !isDesktop && !isLandscape;

  const portraitStyles = "p-4 h-[60%] w-[90%] max-w-[400px] min-w-[300px]";
  const landscapeStyles = "p-2 h-[70%] w-[40%] max-w-[800px] min-w-[300px] relative bottom-[6%]";

  return (
    <div className="flex justify-center items-center h-full">
      <div
        className={`rounded-md bg-teal-400 shadow-xl ${
          isDesktop
            ? "p-6 h-[60%] w-full max-w-[500px] min-w-[300px]"
            : isLandscape
            ? landscapeStyles
            : isPortrait
            ? portraitStyles
            : ""
        }`}
      >
        <div className="h-1/5 pb-2.5 mb-2.5 mobile-landscape:mb-1 mobile-landscape:pb-1 mobile-landscape:h-1/6">
          <AuctionAvatarRow />
        </div>
        <div className="h-2/5 mb-2.5 border-y-2 border-[#e8e8e8] mobile-landscape:h-2/6">
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
