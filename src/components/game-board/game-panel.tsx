// Components
import PlayerBubble from "./player-bubble";
import Hand from "./hand";

// Types
import { GameState } from "types/GameState";
import { GameRoomPlayer } from "types/PlayerProfile";

// Styles
import "./game-panel.css";
import MainGameplayArea from "./gameplay_area/gameplay_area.main";
import { useAuth } from "../../hooks/useAuth";

const GamePanel = (props: { gameState: GameState }) => {
  const { gameState } = props;
  const { playerProfile } = useAuth();

  const gameStateLookup = {
    Bidding: gameState?.biddingPhase,
    "Taking Trick": gameState?.trickTakingPhase,
    "Choosing Teammate": gameState?.biddingPhase,
    Waiting: null,
    Ended: null,
  };

  const gamePlayersListLookup = {
    Bidding: gameStateLookup["Bidding"]?.gameroomPlayersList || [],
    "Taking Trick": gameStateLookup["Taking Trick"]?.gameroomPlayersList || [],
    "Choosing Teammate": gameStateLookup["Choosing Teammate"]?.gameroomPlayersList || [],
    Waiting: [],
    Ended: [],
  };

  const players: GameRoomPlayer[] = gamePlayersListLookup[gameState.status];
  const currentGameState = gameStateLookup[gameState.status];
  const currentPlayerIndex = currentGameState!.currentPlayerIndex;

  const myPlayer = currentGameState?.gameroomPlayersList.find((plyr) => plyr.id === playerProfile?.id);
  const myPosition = myPlayer?.position as number;
  const positionLookup = {
    top: (myPosition + 2) % 4,
    right: (myPosition + 1) % 4,
    bottom: myPosition,
    left: (myPosition + 3) % 4,
  };

  const playerLookup = {
    top: players[positionLookup["top"]],
    right: players[positionLookup["right"]],
    bottom: players[positionLookup["bottom"]],
    left: players[positionLookup["left"]],
  };

  return (
    <div className="game-panel">
      <div className="top">
        <PlayerBubble player={playerLookup["top"]} currentPlayerIndex={currentPlayerIndex} location="top" />
      </div>
      <div className="middle">
        <PlayerBubble
          player={players[positionLookup["left"]]}
          currentPlayerIndex={currentPlayerIndex}
          location="left"
        />

        <MainGameplayArea gameState={gameState} />

        <PlayerBubble
          player={players[positionLookup["right"]]}
          currentPlayerIndex={currentPlayerIndex}
          location="right"
        />
      </div>
      <div className="bottom">
        <div style={{ width: "15%" }}>
          <PlayerBubble
            player={players[positionLookup["bottom"]]}
            currentPlayerIndex={currentPlayerIndex}
            location="bottom"
          />
        </div>
        <div style={{ width: "85%", height: "100%" }}>
          <Hand gameState={gameState} />
        </div>
      </div>
    </div>
  );
};

export default GamePanel;
