import React, { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { useRoom } from "../../../../context/RoomContext";
import { useScreenSize } from "../../../../hooks/useScreenSize";
import { avatarLookup } from "assets/avatar";
import { PublicPlayer } from "types/Player";

interface MatchAvatarProps {
  position: number;
  className?: string;
}

const MatchAvatar: React.FC<MatchAvatarProps> = ({ position, className }) => {
  const { isDesktop } = useScreenSize();
  const { room } = useRoom();
  const { playerAccount } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  if (!playerAccount || !room) return null;

  const phase = room.phase[room.status === "Bidding" ? "biddingPhase" : "trickTakingPhase"];
  const player = room.players.find((p: PublicPlayer) => p.position === position);

  if (!player) return null;

  const avatar = avatarLookup[player.avatarID];
  const isCurrentTurn = player.position === phase?.currentPlayerIndex;
  const isSouthPlayer = player.id === playerAccount.id;

  const baseStyles = "select-none bg-[#FCFBF8] text-[#515151] rounded-[40px] flex items-center shadow-xl";
  const sizeStyles = isDesktop ? "w-[20%] px-5 py-2 text-sm h-18" : "w-[20%] px-3 py-1 text-2xs h-12";
  const turnStyles = isCurrentTurn ? "border-4 border-teal-400 animate-pulse" : "";

  return (
    <div
      className={`${baseStyles} ${sizeStyles} ${turnStyles} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`rounded-full overflow-hidden bg-white ${isDesktop ? "w-[50px] h-[50px]" : "w-[30px] h-[30px]"}`}>
        {avatar && (
          <img
            src={avatar}
            alt={`${player.displayName}'s Avatar`}
            className="w-full h-full object-cover"
            style={{ imageRendering: "pixelated" }}
          />
        )}
      </div>
      <div className={isDesktop ? "ml-2.5 pr-4" : "ml-2 pr-2"}>
        {!isHovered ? (
          <p className={isDesktop ? "text-xs" : "text-3xs"}>
            {isSouthPlayer ? "You" : `[P${position}] ${player.displayName}`}
          </p>
        ) : (
          <p className={`${isDesktop ? "text-xs" : "text-3xs"} text-gray-500`}>Tricks won: {player.numTricksWon}</p>
        )}
      </div>
    </div>
  );
};

export default MatchAvatar;
