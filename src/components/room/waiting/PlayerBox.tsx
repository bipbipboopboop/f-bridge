import { PublicPlayer } from "types/Player";
import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../../hooks/useAuth";

const PlayerBox = ({ player }: { player: PublicPlayer | undefined }) => {
  const { playerAccount } = useAuth();
  const isMe = player && playerAccount?.id === player.id;

  return (
    <div className="text-3xs md:text-xs lg:text-base text-center aspect-square min-w-[50px] min-h-[50px] w-[12rem] m-2.5 bg-black bg-opacity-5 hover:bg-opacity-20 flex flex-col items-center justify-center">
      {player ? (
        <>
          <div>
            <span className="text-2xs md:text-base">{player.isHost ? "👑" : ""}</span>
            <span className={`${isMe ? "text-yellow-400" : "text-white"}`}>{player.displayName}</span>
          </div>
          <img className="h-[5rem]" src={avatarLookup[player.avatarID]} alt={player.displayName} />
          <span>{player.isReady ? "Ready" : "Not Ready"}</span>
        </>
      ) : null}
    </div>
  );
};

export default PlayerBox;
