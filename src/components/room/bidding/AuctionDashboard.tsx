import React, { useEffect, useRef } from "react";
import { useRoom } from "../../../context/RoomContext";
import { Bid } from "types/Bid";
import { useMediaQuery } from "react-responsive";

const AuctionDashboard: React.FC = () => {
  const { room } = useRoom();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      const gridHeight = gridRef.current.offsetHeight;
      const containerHeight = gridRef.current.parentElement?.offsetHeight || 0;
      const isDesktopOverflow = bidHistory.length > 12 && gridHeight > containerHeight;
      const isLandscapeOverflow = bidHistory.length > 8 && gridHeight > containerHeight;

      if (isDesktopOverflow || isLandscapeOverflow) {
        gridRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      } else {
        gridRef.current.scrollTop = 0;
      }
    }
  }, [room?.phase.biddingPhase?.bidHistory.length]);

  if (!room || !room.phase.biddingPhase) {
    return null;
  }

  const { bidHistory } = room.phase.biddingPhase;

  return (
    <div className="h-full overflow-y-auto">
      {bidHistory.length === 0 ? (
        <div className="pt-5 text-center">Start Auction</div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-4 gap-2 overflow-y-auto">
          {bidHistory.map((bid: Bid, index: number) => (
            <BidCell key={index} bid={bid} />
          ))}
        </div>
      )}
    </div>
  );
};

interface BidCellProps {
  bid: Bid;
}

const BidCell: React.FC<BidCellProps> = ({ bid }) => {
  const isDesktop = useMediaQuery({ minWidth: 930 });
  const isLandscape = useMediaQuery({ orientation: "landscape" }) && !isDesktop;

  const gridRows = isDesktop ? "grid-rows-5" : isLandscape ? "grid-rows-4" : "grid-rows-8";
  const textSize = isDesktop ? "text-sm" : isLandscape ? "text-2xs" : "text-2xs";
  const cellHeight = isDesktop ? "h-[40px]" : isLandscape ? "h-[30px]" : "h-[30px]";

  const suitColor =
    bid.suit === "♥" || bid.suit === "♦"
      ? "#FF525D"
      : bid.suit === "NT"
      ? "gold"
      : bid.suit === "Pass"
      ? "yellow-500"
      : "#222222";

  const suitEffect =
    bid.suit === "NT"
      ? "text-shadow: 0 0 5px red, 0 0 10px orange, 0 0 15px red, 0 0 20px orange, 0 0 25px red, 0 0 30px orange, 0 0 35px red animate-pulse"
      : "";

  return (
    <div className={`rounded-md bg-black/5 ${cellHeight} ${textSize} ${gridRows} flex items-center justify-center`}>
      <BidContent
        bid={bid}
        suitColor={suitColor}
        suitEffect={suitEffect}
        isDesktop={isDesktop}
        isLandscape={isLandscape}
      />
    </div>
  );
};

interface BidContentProps {
  bid: Bid;
  suitColor: string;
  suitEffect: string;
  isDesktop: boolean;
  isLandscape: boolean;
}

const BidContent: React.FC<BidContentProps> = ({ bid, suitColor, suitEffect, isDesktop, isLandscape }) => {
  return (
    <span className={suitEffect} style={{ color: suitColor }}>
      {bid.suit === "Pass" ? (
        "Pass"
      ) : (
        <>
          {bid.level}{" "}
          <span className={`${isDesktop ? "text-2xl" : isLandscape ? "text-xl" : "text-lg"}`}>{bid.suit}</span>
        </>
      )}
    </span>
  );
};

export default AuctionDashboard;
