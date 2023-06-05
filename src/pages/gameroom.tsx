import Chatbox from "../components/chat/chatbox";
import GamePanel from "../components/gameroom/game.panel";
import ScoreTable from "../components/tables/game.score.table";

import "./gameroom.css";

const GameRoom = () => {
  return (
    <div className="game-component">
      <div className="left">
        <GamePanel />
      </div>
      <div className="right">
        <div className="top">
          <Chatbox />
        </div>
        <div className="bottom">
          <ScoreTable />
          <div className="d-flex flex-column align-items-center">
            <div>Trump</div>
            <div>NT</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
