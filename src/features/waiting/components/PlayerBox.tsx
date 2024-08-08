import { PublicPlayer } from "types/Player";
import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../../hooks/useAuth";

const PlayerBox = ({ player }: { player: PublicPlayer | undefined }) => {
  const { playerAccount } = useAuth();
  const isMe = player && playerAccount?.id === player.id;

  return (
    <div className="text-4xs min-w-[12vmax] min-h-[12vmax] h-[12vmax] w-[12vmax] md:text-xs bg-black bg-opacity-5 hover:bg-opacity-20 flex flex-col items-center justify-center">
      {player ? (
        <>
          <span className={`${isMe ? "text-yellow-400" : "text-white"} text-center`}>
            {player.isHost ? "👑" : ""} {player.displayName}
          </span>

          <img
            className="h-[3rem]"
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
