import "./player_panel.css";
import { GameRoom } from "types/GameRoom";

import PlayerBox from "./player_box";
import GameRoomButtonPanel from "./game-room-button-panel";

const PlayerPanel = (props: { gameRoom: GameRoom }) => {
  const { gameRoom } = props;
  const { players } = gameRoom;
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
        <GameRoomButtonPanel gameRoom={gameRoom} />
      </div>
    </>
  );
};

export default PlayerPanel;
