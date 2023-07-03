import { LobbyPlayerProfile } from "types/PlayerProfile";
import "./player_box.css";
import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../hooks/useAuth";

const PlayerBox = ({ player }: { player: LobbyPlayerProfile | undefined }) => {
  const { playerProfile } = useAuth();
  if (!player) return <div className="player-box"></div>;

  const isMe = playerProfile?.id === player.id;
  return (
    <div className="player-box">
      <div>
        <span style={{ fontSize: "1.5rem" }}>{player?.isHost ? "👑" : ""}</span>
        <span style={{ fontSize: "0.5rem", color: isMe ? "yellow" : "white" }}>{player?.displayName}</span>
      </div>
      <img style={{ height: "6rem" }} src={avatarLookup[player.avatarID]} />
      <span>{`${player?.isReady ? "Ready" : "Not Ready"}`}</span>
    </div>
  );
};

export default PlayerBox;
