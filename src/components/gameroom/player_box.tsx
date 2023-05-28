import {LobbyPlayerProfile} from "types/PlayerProfile";

const PlayerBox = ({player}: {player: LobbyPlayerProfile}) => {
  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <span>{player?.displayName}</span>
      <span>{`${player?.isReady ? "Ready" : ""}`}</span>
    </div>
  );
};

export default PlayerBox;
