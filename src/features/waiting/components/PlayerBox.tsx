import { PublicPlayer } from "types/Player";
import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../../hooks/useAuth";

const PlayerBox = ({ player }: { player: PublicPlayer | undefined }) => {
  const { playerAccount } = useAuth();
  const isMe = player && playerAccount?.id === player.id;

  return (
    <div className="text-3xs min-w-[13vmax] min-h-[13vmax] h-[13vmax] w-[13vmax] md:text-base md:min-w-[15vmax] md:min-h-[15vmax] md:h-[15vmax] md:w-[15vmax] bg-black bg-opacity-5 hover:bg-opacity-20 flex flex-col items-center justify-center">
      {player ? (
        <>
          <span className={`${isMe ? "text-yellow-400" : "text-white"} text-center`}>
            {player.isHost ? "👑" : ""} {player.displayName}
          </span>

          <img
            className="h-10 md:h-24 md:max-h-24 overflow-clip"
            src={avatarLookup[player.avatarID]}
            alt={player.displayName}
            style={{ imageRendering: "pixelated" }}
          />
          <span>{player.isReady ? "Ready" : "Not Ready"}</span>
        </>
      ) : null}
    </div>
  );
};

export default PlayerBox;
