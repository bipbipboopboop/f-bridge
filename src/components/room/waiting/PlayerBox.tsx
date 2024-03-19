import { PublicPlayer } from "types/Player";
import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../../hooks/useAuth";

const PlayerBox = ({ player }: { player: PublicPlayer | undefined }) => {
  const { playerAccount } = useAuth();

  if (!player) return <div className="w-44 h-44 m-2.5 bg-black bg-opacity-5 hover:bg-opacity-20"></div>;

  const isMe = playerAccount?.id === player.id;

  return (
    <div className="flex flex-col items-center justify-center w-44 h-44 m-2.5 bg-black bg-opacity-5 hover:bg-opacity-20">
      <div>
        <span className="text-2xl">{player?.isHost ? "👑" : ""}</span>
        <span className={`text-xs ${isMe ? "text-yellow-400" : "text-white"}`}>{player?.displayName}</span>
      </div>
      <img className="h-24" src={avatarLookup[player.avatarID]} alt={player.displayName} />
      <span>{player?.isReady ? "Ready" : "Not Ready"}</span>
    </div>
  );
};

export default PlayerBox;
