import React from "react";
import {LobbyPlayerProfile} from "types/PlayerProfile";

interface PlayerPanelProps {
  players: LobbyPlayerProfile[];
}

const PlayerBox = ({player}: {player: LobbyPlayerProfile}) => {
  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <span>{player?.displayName}</span>
      <span>{`${player?.isReady ? "Ready" : ""}`}</span>
    </div>
  );
};

const PlayerPanel: React.FC<PlayerPanelProps> = ({players}) => {
  return (
    <>
      <h4>Players</h4>
      <div className="d-flex flex-column w-100 h-100">
        {/* Player Box Row */}
        <div className="d-flex w-100 h-50">
          <PlayerBox player={players[0]} />
          <PlayerBox player={players[1]} />
        </div>

        {/* Player Box Row */}
        <div className="d-flex w-100 h-50">
          <PlayerBox player={players[2]} />
          <PlayerBox player={players[3]} />
        </div>
      </div>
    </>
  );
};

export default PlayerPanel;
