import React from "react";
import { useRoom } from "../../../context/RoomContext";
import { avatarLookup } from "assets/avatar";

const TrickMonitor: React.FC = () => {
  const { room } = useRoom();

  if (!room || room.status !== "Taking Trick" || !room.phase.trickTakingPhase) {
    return null;
  }

  const { players, phase } = room;
  const { trickTakingPhase } = phase;
  const { trumpSuit } = trickTakingPhase!;

  const getTrumpSuitColor = (suit: string) => {
    if (suit === "♥" || suit === "♦") {
      return "text-red-500";
    } else if (suit === "NT") {
      return "text-yellow-500";
    } else {
      return "text-black";
    }
  };

  return (
    <div className="bg-teal-400 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Tricks Won</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {players.map((player) => (
          <div key={player.id} className="flex flex-col items-center">
            <img src={avatarLookup[player.avatarID]} alt={player.displayName} className="w-16 h-16 rounded-full mb-2" />
            <div className="text-center border-b-2 border-white pb-2">
              <p className="text-sm">{player.displayName}</p>
            </div>
            <p className="text-lg font-bold mt-2">{player.numTricksWon}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className={`text-2xl font-bold ${getTrumpSuitColor(trumpSuit!)}`}>Trump Suit: {trumpSuit}</p>
      </div>
    </div>
  );
};

export default TrickMonitor;
