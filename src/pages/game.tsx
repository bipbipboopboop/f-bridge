import Chatbox from "../components/chat/chatbox";
import GamePanel from "../components/game/game.panel";
import ScoreTable from "../components/tables/game.score.table";
import RoomTable from "../components/tables/lobby.table";
import "./game.css";

const GameComponent = () => {
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

export default GameComponent;
