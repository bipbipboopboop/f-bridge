import Chatbox from "../components/chat/chatbox";
import RoomTable from "../components/tables/lobby.table";
import "./game.css";

const GameComponent = () => {
  return (
    <div className="game-component">
      <div className="left">Hi</div>
      <div className="right">
        <div className="top">
          <Chatbox />
        </div>
        <div className="bottom">
          <RoomTable />
        </div>
      </div>
    </div>
  );
};

export default GameComponent;
