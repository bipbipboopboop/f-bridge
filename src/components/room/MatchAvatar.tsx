import { avatarLookup } from "assets/avatar";
import { useRoom } from "../../context/RoomContext";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

interface MatchAvatarProps {
  position: number;
  className?: string;
}

const MatchAvatar: React.FC<MatchAvatarProps> = ({ position, className }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 }); // Adjust the breakpoint as needed
  const isLandscape = useMediaQuery({ orientation: "landscape" });

  if (isDesktop) return <MatchAvatarWeb position={position} className={className} />;
  if (isLandscape) {
    return <MatchAvatarLandscape position={position} className={className} />;
  }
  return <></>;
};

const MatchAvatarWeb: React.FC<MatchAvatarProps> = ({ position, className }) => {
  const { room } = useRoom();
  const { playerAccount } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  if (!playerAccount || !room) {
    return null;
  }

  const phase = room.phase[room.status === "Bidding" ? "biddingPhase" : "trickTakingPhase"];
  const player = room.players.find((player) => player.position === position);
  const avatar = player ? avatarLookup[player.avatarID] : null;
  const isCurrentTurn = player?.position === phase?.currentPlayerIndex;
  const isSouthPlayer = player?.id === playerAccount.id;

  return (
    <div
      className={`select-none w-[20%] bg-[#FCFBF8] text-[#515151] px-5 py-2 rounded-[40px] text-sm flex items-center shadow-xl h-18 ${
        isCurrentTurn ? "border-4 border-teal-400 animate-pulse" : ""
      } ${className}`}
      style={{ zIndex: 100 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-white">
        {avatar && <img src={avatar} alt="Player Avatar" className="w-full h-full object-cover" />}
      </div>
      <div className="ml-2.5 pr-4">
        {!isHovered && <p className="text-xs">{isSouthPlayer ? "You" : `[P${position}] ${player?.displayName}`}</p>}
        {isHovered && <p className="text-xs text-gray-500">Tricks won: {player?.numTricksWon || 0}</p>}
      </div>
    </div>
  );
};

const MatchAvatarLandscape: React.FC<MatchAvatarProps> = ({ position, className }) => {
  const { room } = useRoom();
  const { playerAccount } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  if (!playerAccount || !room) {
    return null;
  }

  const phase = room.phase[room.status === "Bidding" ? "biddingPhase" : "trickTakingPhase"];
  const player = room.players.find((player) => player.position === position);
  const avatar = player ? avatarLookup[player.avatarID] : null;
  const isCurrentTurn = player?.position === phase?.currentPlayerIndex;
  const isSouthPlayer = player?.id === playerAccount.id;

  return (
    <div
      className={`select-none w-[15%] bg-[#FCFBF8] text-[#515151] px-3 py-1 rounded-[40px] text-xs flex items-center shadow-xl h-12 ${
        isCurrentTurn ? "border-4 border-teal-400 animate-pulse" : ""
      } ${className}`}
      style={{ zIndex: 100 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-[30px] h-[30px] rounded-full overflow-hidden bg-white">
        {avatar && <img src={avatar} alt="Player Avatar" className="w-full h-full object-cover" />}
      </div>
      <div className="ml-2 pr-2">
        {!isHovered && <p className="text-3xs">{isSouthPlayer ? "You" : `[P${position}] ${player?.displayName}`}</p>}
        {isHovered && <p className="text-3xs text-gray-500">Tricks won: {player?.numTricksWon || 0}</p>}
      </div>
    </div>
  );
};

export default MatchAvatar;
