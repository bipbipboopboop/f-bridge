import React from "react";
import { useRoom } from "../../../context/RoomContext";

import { avatarLookup } from "assets/avatar";
import Confetti from "react-confetti";

const EndedRoom: React.FC = () => {
  const { room } = useRoom();

  if (!room || room.status !== "Ended" || !room.phase.endedPhase) {
    return null;
  }

  const { winnerTeam, winners } = room.phase.endedPhase;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">{winnerTeam} Team Won!</h1>
      <div className="grid grid-cols-2 gap-8">
        {winners.map((player) => (
          <div key={player.id} className="flex flex-col items-center">
            <img src={avatarLookup[player.avatarID]} alt={player.displayName} className="w-32 h-32 rounded-full mb-4" />
            <h2 className="text-2xl font-bold">{player.displayName}</h2>
          </div>
        ))}
      </div>
      <Confetti />
    </div>
  );
};

export default EndedRoom;
