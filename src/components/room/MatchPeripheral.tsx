import { useAuth } from "../../hooks/useAuth";
import { useRestrictedPlayerData } from "../../context/RestrictedPlayerContext";
import { useRoom } from "../../context/RoomContext";
import { useGameState } from "../../context/GameStateContext";

import MatchAvatar from "./MatchAvatar";
import PlayerHand from "./PlayerHand";
import OpponentHand from "./OpponentHand";

const MatchPeripheral: React.FC = () => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();
  const { biddingPhase, trickTakingPhase } = useGameState();
  const { restrictedPlayer } = useRestrictedPlayerData();

  if (!playerAccount || !room || !restrictedPlayer) {
    return null;
  }

  const isBiddingPhase = room.status === "Bidding";
  const isTrickTakingPhase = room.status === "Taking Trick";

  const phase = isBiddingPhase ? biddingPhase : isTrickTakingPhase ? trickTakingPhase : null;

  const southPlayerPosition = phase!.players.find((player) => player.id === playerAccount.id)!.position as number;
  const westPlayerPosition = (southPlayerPosition + 3) % 4;
  const northPlayerPosition = (southPlayerPosition + 2) % 4;
  const eastPlayerPosition = (southPlayerPosition + 1) % 4;

  return (
    <div className="top-0 left-0 w-full h-full">
      <PlayerHand />

      <MatchAvatar position={westPlayerPosition} className="absolute top-1/4 left-10" />
      <MatchAvatar position={northPlayerPosition} className="absolute top-5 left-28" />
      <MatchAvatar position={eastPlayerPosition} className="absolute top-1/4 right-10" />
      <MatchAvatar position={southPlayerPosition} className="absolute bottom-[16%] right-10" />

      <OpponentHand direction="west" className="absolute top-1/3 left-[22%]" />
      <OpponentHand direction="north" className="absolute top-5 left-1/2 transform -translate-x-1/2" />
      <OpponentHand direction="east" className="absolute top-1/3 right-[22%]" />
    </div>
  );
};

export default MatchPeripheral;
