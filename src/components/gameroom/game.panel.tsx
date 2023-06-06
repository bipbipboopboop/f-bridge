import GreenButton from "../buttons/button.green";
import Hand from "./hand";
import PlayerBubble from "./player_bubble";
import PlayingArea from "./playing_area";

const GamePanel = () => {
  return (
    <div className="h-100 w-100 d-flex flex-column">
      <div className="d-flex justify-content-center h-50">
        <PlayerBubble />
      </div>
      <div className="d-flex justify-content-between h-100">
        <PlayerBubble />
        <PlayingArea />
        <PlayerBubble />
      </div>
      <div className="d-flex justify-content-between h-50 align-items-end">
        <PlayerBubble />
        <Hand />
        <GreenButton>Play</GreenButton>
      </div>
    </div>
  );
};

export default GamePanel;
