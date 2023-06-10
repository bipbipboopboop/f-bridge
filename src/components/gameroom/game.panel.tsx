// Common Component
import GreenButton from "../buttons/button.green";

// Components
import PlayerBubble from "./player_bubble";
import PlayingArea from "./playing_area/playing_area";
import Hand from "./hand";

// Types
import {GameState} from "types/GameState";
import {GameRoomPlayer} from "types/PlayerProfile";

// Styles
import "./game.panel.css";

const GamePanel = (props: {gameState: GameState}) => {
  const {gameState} = props;

  const gamePlayersListLookup = {
    Bidding: gameState?.biddingPhase?.gameroomPlayersList || [],
    "Taking Trick": gameState?.trickTakingPhase?.gameroomPlayersList || [],
    Waiting: [],
  };

  const players: GameRoomPlayer[] = gamePlayersListLookup[gameState.status];

  return (
    <div className="game-panel">
      <div className="top">
        <PlayerBubble
          player={players[0]}
          currentPlayerIndex={0}
          location="top"
        />
      </div>
      <div className="middle">
        <PlayerBubble
          player={players[1]}
          currentPlayerIndex={0}
          location="left"
        />

        {/* TODO: Change based on status */}
        <PlayingArea gameState={gameState} />

        <PlayerBubble
          player={players[2]}
          currentPlayerIndex={0}
          location="right"
        />
      </div>
      <div className="bottom">
        <PlayerBubble
          player={players[3]}
          currentPlayerIndex={0}
          location="bottom"
        />
        <Hand />

        {/* TODO: Change based on status */}
        <div className="d-flex flex-column justify-content-between  ">
          <GreenButton>Sort</GreenButton>
          <GreenButton>Play</GreenButton>
        </div>
      </div>
    </div>
  );
};

export default GamePanel;
