import {GameRoomPlayer} from "types/PlayerProfile";
import dino_sprite_1 from "assets/player_assets/dino_sprite_1.gif";
import "./player-bubble.css";

type Props = {
  player: GameRoomPlayer;
  currentPlayerIndex: 0 | 1 | 2 | 3;
  location: "top" | "bottom" | "left" | "right";
};

const PlayerBubble = (props: Props) => {
  const {player, currentPlayerIndex, location} = props;
  const isPlayerTurn = currentPlayerIndex === player.position;
  return (
    <div className={`player-bubble-${location} ${isPlayerTurn ? "selected" : "waiting"}`}>
      <div className="d-flex justify-content-center">{player.displayName}</div>
      <div className="d-flex align-items-center">
        <img src={dino_sprite_1} alt={":/"} />
        <PlayerNumCardHint numCardsOnHand={player.numCardsOnHand} />
      </div>
    </div>
  );
};

export default PlayerBubble;

const PlayerNumCardHint = (props: {numCardsOnHand: number}) => {
  return (
    <div className="d-flex align-items-center justify-content-around">
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "white",
          color: "black",
          height: "40px",
          width: "30px",
          borderRadius: "5px",
        }}
      >
        <div>
          <div>♣</div>
          <div
            style={{
              color: "#e44145",
            }}
          >
            ♦
          </div>
        </div>
        <div>
          <div
            style={{
              color: "#e44145",
            }}
          >
            ♥
          </div>
          <div>♠</div>
        </div>
      </div>
      {props.numCardsOnHand}
    </div>
  );
};
