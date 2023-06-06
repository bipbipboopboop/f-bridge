import GreenButton from "../buttons/button.green";
import Hand from "./hand";
import PlayerBubble from "./player_bubble";
import PlayingArea from "./playing_area";

import "./game.panel.css";

const GamePanel = () => {
  return (
    <div className="game-panel">
      <div className="top">
        <PlayerBubble />
      </div>
      <div className="middle">
        <PlayerBubble />
        <PlayingArea />
        <PlayerBubble />
      </div>
      <div className="bottom">
        <PlayerBubble />
        <Hand />
        <div className="d-flex flex-column justify-content-between  ">
          <GreenButton>Sort</GreenButton>
          <GreenButton>Play</GreenButton>
        </div>
      </div>
    </div>
  );
};

export default GamePanel;
