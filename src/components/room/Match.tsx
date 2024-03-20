import { useAuth } from "../../hooks/useAuth";
import { useRestrictedPlayerData } from "../../context/RestrictedPlayerContext";
import { useRoom } from "../../context/RoomContext";
import { useBiddingPhase } from "../../context/BiddingContext";
import MatchAvatar from "./MatchAvatar";
import PlayerHand from "./PlayerHand";
import OpponentHand from "./OpponentHand";

const Match: React.FC = () => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();
  const { biddingPhase } = useBiddingPhase();
  // const { trickTakingPhase } = useTrickTakingPhase();
  const { restrictedPlayer } = useRestrictedPlayerData();

  if (!playerAccount || !room || !biddingPhase || !restrictedPlayer) {
    return null;
  }

  const isBiddingPhase = room.status === "Bidding";
  const isTrickTakingPhase = room.status === "Taking Trick";

  // const phase = isBiddingPhase ? biddingPhase : isTrickTakingPhase ? trickTakingPhase : null;
  const phase = isBiddingPhase ? biddingPhase : null;

  if (!phase) {
    return null;
  }

  const southPlayerPosition = phase.players.find((player) => player.id === playerAccount.id)!.position as number;
  const westPlayerPosition = (southPlayerPosition + 3) % 4;
  const northPlayerPosition = (southPlayerPosition + 2) % 4;
  const eastPlayerPosition = (southPlayerPosition + 1) % 4;

  const currentPlayerIndex = phase.currentPlayerIndex;
  const currentPlayerId = phase.players[currentPlayerIndex].id;

  return (
    <div className="top-0 left-0 w-full h-full">
      <PlayerHand />

      <MatchAvatar position={westPlayerPosition} className="absolute top-1/4 left-10" />
      <MatchAvatar position={northPlayerPosition} className="absolute top-5 left-28" />
      <MatchAvatar position={eastPlayerPosition} className="absolute top-1/4 right-10" />
      <MatchAvatar position={southPlayerPosition} className="absolute bottom-[16%] right-10" />

      <OpponentHand
        position={westPlayerPosition}
        numCards={phase.players.find((player) => player.position === westPlayerPosition)?.numCardsOnHand || 0}
        className="absolute top-1/3 left-[22%]"
      />
      <OpponentHand
        position={northPlayerPosition}
        numCards={phase.players.find((player) => player.position === northPlayerPosition)?.numCardsOnHand || 0}
        className="absolute top-5 left-1/2 transform -translate-x-1/2"
      />
      <OpponentHand
        position={eastPlayerPosition}
        numCards={phase.players.find((player) => player.position === eastPlayerPosition)?.numCardsOnHand || 0}
        className="absolute top-1/3 right-[22%]"
      />
    </div>
  );
};

export default Match;
