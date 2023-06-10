import GreenButton from "../buttons/button.green";
import Hand from "./hand";
import PlayerBubble from "./player_bubble";
import PlayingArea from "./playing_area";

import "./game.panel.css";
import {GameState} from "types/GameState";
import {GameRoomPlayer} from "types/PlayerProfile";

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
        <div className="d-flex flex-column justify-content-between  ">
          <GreenButton>Sort</GreenButton>
          <GreenButton>Play</GreenButton>
        </div>
      </div>
    </div>
  );
};

export default GamePanel;
