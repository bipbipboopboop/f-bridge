// Components
import PlayerBubble from "./player-bubble";
import Hand from "./hand";

// Types
import { GameRoom } from "types/GameRoom";
import { GameRoomPlayer } from "types/PlayerProfile";

// Styles
import "./game-panel.css";
import MainGameplayArea from "./gameplay_area/gameplay_area.main";
import { useAuth } from "../../hooks/useAuth";

const GamePanel = (props: { gameRoom: GameRoom }) => {
  const { gameRoom } = props;
  const { playerProfile } = useAuth();

  const gameRoomLookup = {
    Bidding: gameRoom?.biddingPhase,
    "Taking Trick": gameRoom?.trickTakingPhase,
    "Choosing Teammate": gameRoom?.biddingPhase,
    Waiting: null,
    Ended: null,
  };

  const gamePlayersListLookup = {
    Bidding: gameRoomLookup["Bidding"]?.gameroomPlayersList || [],
    "Taking Trick": gameRoomLookup["Taking Trick"]?.gameroomPlayersList || [],
    "Choosing Teammate": gameRoomLookup["Choosing Teammate"]?.gameroomPlayersList || [],
    Waiting: [],
    Ended: [],
  };

  const players: GameRoomPlayer[] = gamePlayersListLookup[gameRoom.status];
  const currentGameRoom = gameRoomLookup[gameRoom.status];
  const currentPlayerIndex = currentGameRoom!.currentPlayerIndex;

  const myPlayer = currentGameRoom?.gameroomPlayersList.find((plyr) => plyr.id === playerProfile?.id);
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

        <MainGameplayArea gameRoom={gameRoom} />

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
          <Hand gameRoom={gameRoom} />
        </div>
      </div>
    </div>
  );
};

export default GamePanel;
