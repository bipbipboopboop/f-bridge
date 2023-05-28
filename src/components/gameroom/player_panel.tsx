import React from "react";
import {LobbyPlayerProfile} from "types/PlayerProfile";
import OrangeButton from "../buttons/button.orange";
import PlayerBox from "./player_box";
import {Link} from "react-router-dom";

interface PlayerPanelProps {
  players: LobbyPlayerProfile[];
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({players}) => {
  return (
    <>
      <div style={{height: "90%"}}>
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
      </div>
      <div className="d-flex" style={{height: "10%"}}>
        <OrangeButton>
          <Link to="/game_table">Start Game</Link>
        </OrangeButton>
      </div>
    </>
  );
};

export default PlayerPanel;
