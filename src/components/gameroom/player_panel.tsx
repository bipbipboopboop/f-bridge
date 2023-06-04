import React from "react";
import {LobbyPlayerProfile} from "types/PlayerProfile";
import OrangeButton from "../buttons/button.orange";
import PlayerBox from "./player_box";
import {Link} from "react-router-dom";

import "./player_panel.css";

interface PlayerPanelProps {
  players: LobbyPlayerProfile[];
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({players}) => {
  return (
    <>
      <h4>Players</h4>
      <div className="h-75">
        <div className="player-panel">
          {/* Player Box Row */}
          <div className="player-panel-row">
            <PlayerBox player={players[0]} />
            <PlayerBox player={players[1]} />
          </div>

          {/* Player Box Row */}
          <div className="player-panel-row">
            <PlayerBox player={players[2]} />
            <PlayerBox player={players[3]} />
          </div>
        </div>
        <div>
          <OrangeButton>
            <Link to="/game_table">Start Game</Link>
          </OrangeButton>
        </div>
      </div>
    </>
  );
};

export default PlayerPanel;
