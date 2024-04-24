import React from "react";
import { useRoom } from "../../../../../context/RoomContext";
import { avatarLookup } from "assets/avatar";
import { BidSuit } from "types/Bid";

const TrickMonitor: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const { room } = useRoom();

  if (!room || room.status !== "Taking Trick" || !room.phase.trickTakingPhase) {
    return null;
  }

  const { players, phase } = room;
  const { trickTakingPhase } = phase;
  const { trumpSuit } = trickTakingPhase!;

  const trumpSuitColorLookup: Record<BidSuit, string> = {
    "♠": "text-black",
    "♣": "text-black",
    "♥": "text-red-500",
    "♦": "text-red-500",
    NT: "text-yellow-500",
    Pass: "text-gray-500",
  };

  const HighestBidText = () => (
    <>
      <span className={`font-bold ${trumpSuitColorLookup[trumpSuit!]}`}>
        {room.phase.trickTakingPhase!.declarerTricksNeeded - 6}
      </span>
      <span className={`text-2xl font-bold ${trumpSuitColorLookup[trumpSuit!]}`}>{trumpSuit}</span>
    </>
  );

  return (
    <div className={`bg-teal-400 shadow-md rounded-lg p-6 select-none ${className}`} {...props}>
      <h2 className="mb-2 text-center">Tricks Won</h2>
      <div className="grid grid-cols-4 gap-4 mb-2 border-y-2 py-2 ${}">
        {players.map((player) => (
          <div key={player.id} className={`flex flex-col items-center`}>
            <img
              src={avatarLookup[player.avatarID]}
              alt={player.displayName}
              className="w-8 h-8 rounded-full mb-2"
              style={{ imageRendering: "pixelated" }}
            />
            <div className="text-center border-b-2 border-white pb-2">
              <p className="text-xs">P{player.position}</p>
            </div>
            <p className="text-xs font-bold mt-2">{player.numTricksWon}</p>
          </div>
        ))}
      </div>
      <div className="text-xs text-center">
        <p>Highest Bid:</p>
        <HighestBidText />
      </div>
    </div>
  );
};

export default TrickMonitor;
