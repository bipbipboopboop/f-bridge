import {GameState} from "types/GameState";
import {useAuth} from "../../hooks/useAuth";
import useFunctions from "../../hooks/useFunctions";
import {useParams} from "react-router-dom";
import Button from "../buttons/button";

const GameRoomButtonPanel = (props: {gameState: GameState}) => {
  const {playerProfile} = useAuth();
  const {toggleReady, startGame} = useFunctions();
  const {roomID} = useParams();

  const {gameState} = props;

  const isRoomFull = gameState.players.length === 4;
  const otherPlayers = gameState.players.filter(
    (player) => player.id !== playerProfile?.id
  );
  const isGameReady =
    isRoomFull && otherPlayers.every((player) => player.isReady);
  const isPlayerAHost =
    gameState.players.find((player) => player.isHost)?.id === playerProfile?.id;

  const isPlayerReady = gameState.players.find(
    (player) => player.id === playerProfile?.id
  )?.isReady;

  if (isPlayerAHost) {
    return (
      <div className="d-flex justify-content-center">
        <Button
          theme="orange"
          onClick={async () => {
            await toggleReady(roomID);
            await startGame();
          }}
          disabled={!isGameReady}
        >
          Start Game
        </Button>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center">
      <Button theme="orange" onClick={async () => await toggleReady(roomID)}>
        {isPlayerReady ? "Cancel" : "Ready"}
      </Button>
    </div>
  );
};

export default GameRoomButtonPanel;
