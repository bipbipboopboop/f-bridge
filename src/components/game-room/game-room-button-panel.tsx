import OrangeButton from "../buttons/button-orange";
import {GameState} from "types/GameState";
import {useAuth} from "../../hooks/useAuth";
import useFunctions from "../../hooks/useFunctions";
import {useParams} from "react-router-dom";

const GameRoomButtonPanel = (props: {gameState: GameState}) => {
  const {playerProfile} = useAuth();
  const {toggleReady, startGame} = useFunctions();
  const {roomID} = useParams();

  const {gameState} = props;

  const isRoomFull = gameState.players.length === 4;
  const otherPlayers = gameState.players.filter((player) => player.id !== playerProfile?.id);
  const isGameReady = isRoomFull && otherPlayers.every((player) => player.isReady);
  const isPlayerAHost = gameState.players.find((player) => player.isHost)?.id === playerProfile?.id;

  const isPlayerReady = gameState.players.find((player) => player.id === playerProfile?.id)?.isReady;

  if (isPlayerAHost) {
    return (
      <div className="d-flex justify-content-center">
        <OrangeButton
          onClick={async () => {
            await toggleReady(roomID);
            await startGame();
          }}
          disabled={!isGameReady}
        >
          Start Game
        </OrangeButton>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center">
      <OrangeButton onClick={async () => await toggleReady(roomID)}>{isPlayerReady ? "Cancel" : "Ready"}</OrangeButton>
    </div>
  );
};

export default GameRoomButtonPanel;
