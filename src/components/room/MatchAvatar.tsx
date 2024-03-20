import { avatarLookup } from "assets/avatar";
import { useBiddingPhase } from "../../context/BiddingContext";
import { useRoom } from "../../context/RoomContext";
import { PublicBiddingPhase, PublicTrickTakingPhase } from "types/GameState";
import { useAuth } from "../../hooks/useAuth";
// import { useTrickTakingPhase } from "../../context/TrickTakingPhaseContext";

interface MatchAvatarProps {
  position: number;
  className?: string;
}

const MatchAvatar: React.FC<MatchAvatarProps> = ({ position, className }) => {
  const { room } = useRoom();
  const { biddingPhase } = useBiddingPhase();
  const { playerAccount } = useAuth();
  // const { trickTakingPhase } = useTrickTakingPhase();

  if (!playerAccount || !biddingPhase || !room) {
    return null;
  }

  let phase: PublicBiddingPhase | PublicTrickTakingPhase;

  if (room.status === "Bidding") {
    phase = biddingPhase!;
  } else {
    phase = biddingPhase!;
  }

  const player = phase?.players.find((player) => player.position === position);
  const avatar = player ? avatarLookup[player.avatarID] : null;

  let isCurrentTurn = false;
  if (room.status === "Bidding" && biddingPhase) {
    isCurrentTurn = player?.id === biddingPhase.players[biddingPhase.currentPlayerIndex].id;
  }

  const isSouthPlayer = player?.id === playerAccount.id;

  return (
    <div
      className={`w-[15%] bg-[#FCFBF8] text-[#515151] px-5 py-2 rounded-[40px] text-sm flex items-center shadow-xl ${
        isCurrentTurn ? "border-4 border-teal-400 animate-pulse" : ""
      } ${className}`}
    >
      <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-white">
        {avatar && <img src={avatar} alt="Player Avatar" className="w-full h-full object-cover" />}
      </div>

      <div className="ml-2.5 pr-4">{isSouthPlayer ? "You" : `P${position}`}</div>
    </div>
  );
};

export default MatchAvatar;
