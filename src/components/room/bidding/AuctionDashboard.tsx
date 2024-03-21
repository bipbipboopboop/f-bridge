import React, { useEffect, useRef } from "react";
import { useRoom } from "../../../context/RoomContext";
import { Bid } from "types/Bid";

const AuctionDashboard: React.FC = () => {
  const { room } = useRoom();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      const gridHeight = gridRef.current.offsetHeight;
      const containerHeight = gridRef.current.parentElement?.offsetHeight || 0;

      if (gridHeight > containerHeight && bidHistory.length > 12) {
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
        <div ref={gridRef} className="grid grid-cols-4 gap-2 grid-rows-5 overflow-y-auto">
          {bidHistory.map((bid: Bid, index: number) => {
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
              <div key={index} className="text-sm text-center rounded-md bg-black/5 h-[40px] py-3">
                <span className={suitEffect} style={{ color: suitColor }}>
                  {bid.suit === "Pass" ? "Pass" : `${bid.level} ${bid.suit}`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuctionDashboard;
