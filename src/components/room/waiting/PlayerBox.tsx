import { PublicPlayer } from "types/Player";
import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../../hooks/useAuth";

const PlayerBox = ({ player }: { player: PublicPlayer | undefined }) => {
  const { playerAccount } = useAuth();
  const isMe = player && playerAccount?.id === player.id;

  return (
    <div className="text-3xs lg:text-base text-center aspect-square w-[12rem] min-w-[50px] min-h-[50px] m-2.5 bg-black bg-opacity-5 hover:bg-opacity-20 flex flex-col items-center justify-center mobile-portrait:h-[120px] mobile-portrait:w-[120px] mobile-landscape:h-[10vw] mobile-landscape:w-[10vw]">
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
