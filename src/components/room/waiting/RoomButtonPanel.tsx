import { GameRoom } from "types/Room";

import { useParams } from "react-router-dom";
import Button from "../../buttons/button";
import { useAuth } from "../../../hooks/useAuth";
import { useFunctions } from "../../../hooks/useFunctions";
import { HTMLAttributes } from "react";

const RoomButtonPanel: React.FC<HTMLAttributes<HTMLDivElement> & { room: GameRoom }> = (props) => {
  const { room, className, ...rest } = props;
  const { playerAccount } = useAuth();
  const { toggleReady, startGame } = useFunctions();
  const { roomID } = useParams<{ roomID: string }>();

  if (!roomID) return null;

  const isRoomFull = room.players.length === 4;
  const otherPlayers = room.players.filter((player) => player.id !== playerAccount?.id);
  const isGameReady = isRoomFull && otherPlayers.every((player) => player.isReady);
  const isPlayerAHost = room.players.find((player) => player.isHost)?.id === playerAccount?.id;
  const isPlayerReady = room.players.find((player) => player.id === playerAccount?.id)?.isReady;

  if (isPlayerAHost) {
    return (
      <div className={`h-full flex flex-col justify-end ${className}`} {...rest}>
        <Button
          theme="orange"
          size={2}
          onClick={async () => {
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
    <div className="h-full flex flex-col justify-end">
      <Button theme="orange" size={2} onClick={async () => await toggleReady(roomID)}>
        {isPlayerReady ? "Cancel" : "Ready"}
      </Button>
    </div>
  );
};

export default RoomButtonPanel;
