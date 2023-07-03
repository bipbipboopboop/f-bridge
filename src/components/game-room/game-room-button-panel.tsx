import { GameRoom } from "types/GameRoom";
import { useAuth } from "../../hooks/useAuth";
import useFunctions from "../../hooks/useFunctions";
import { useParams } from "react-router-dom";
import Button from "../buttons/button";

const GameRoomButtonPanel = (props: { gameRoom: GameRoom }) => {
  const { playerProfile } = useAuth();
  const { toggleReady, startGame } = useFunctions();
  const { roomID } = useParams();

  const { gameRoom } = props;

  const isRoomFull = gameRoom.players.length === 4;
  const otherPlayers = gameRoom.players.filter((player) => player.id !== playerProfile?.id);
  const isGameReady = isRoomFull && otherPlayers.every((player) => player.isReady);
  const isPlayerAHost = gameRoom.players.find((player) => player.isHost)?.id === playerProfile?.id;

  const isPlayerReady = gameRoom.players.find((player) => player.id === playerProfile?.id)?.isReady;

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
