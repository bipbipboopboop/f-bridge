// Common Component
import GreenButton from "../buttons/button-green";

// Components
import PlayerBubble from "./player-bubble";
import Hand from "./hand";

// Types
import {GameState} from "types/GameState";
import {GameRoomPlayer} from "types/PlayerProfile";

// Styles
import "./game-panel.css";
import MainGameplayArea from "./gameplay_area/gameplay_area.main";

const GamePanel = (props: {gameState: GameState}) => {
  const {gameState} = props;

  const gamePlayersListLookup = {
    Bidding: gameState?.biddingPhase?.gameroomPlayersList || [],
    "Taking Trick": gameState?.trickTakingPhase?.gameroomPlayersList || [],
    Waiting: [],
  };

  const players: GameRoomPlayer[] = gamePlayersListLookup[gameState.status];

  // TODO: change current player index based on status
  return (
    <div className="game-panel">
      <div className="top">
        <PlayerBubble player={players[0]} currentPlayerIndex={0} location="top" />
      </div>
      <div className="middle">
        <PlayerBubble player={players[1]} currentPlayerIndex={0} location="left" />

        <MainGameplayArea gameState={gameState} />

        <PlayerBubble player={players[2]} currentPlayerIndex={0} location="right" />
      </div>
      <div className="bottom">
        <div style={{width: "15%"}}>
          <PlayerBubble player={players[3]} currentPlayerIndex={0} location="bottom" />
        </div>
        <div style={{width: "70%"}}>
          <Hand />
        </div>

        {/* TODO: Change based on status */}
        <div style={{width: "15%"}} className="d-flex flex-column justify-content-between  ">
          {/* <GreenButton>Sort</GreenButton>
          <GreenButton>Play</GreenButton> */}
        </div>
      </div>
    </div>
  );
};

export default GamePanel;
