import {GameRoomPlayer} from "types/PlayerProfile";
import dino_sprite_1 from "assets/player_assets/dino_sprite_1.gif";
import "./player_bubble.css";

type Props = {
  player: GameRoomPlayer;
  currentPlayerIndex: 0 | 1 | 2 | 3;
};

const PlayerBubble = (props: Props) => {
  const {player, currentPlayerIndex} = props;
  const isPlayerTurn = currentPlayerIndex === player.position;
  return (
    <div className={`player-bubble-${isPlayerTurn ? "selected" : "waiting"}`}>
      <div className="d-flex align-items-center">
        <img src={dino_sprite_1} />
      </div>
      <div className="d-flex justify-content-center">{player.displayName}</div>
      <div
        className="d-flex align-items-center justify-content-around"
        style={{backgroundColor: "gray"}}
      >
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
            <div style={{color: "#e44145"}}>♦</div>
          </div>
          <div>
            <div style={{color: "#e44145"}}>♥</div>
            <div>♠</div>
          </div>
        </div>
        {player.numCardsOnHand}
      </div>
    </div>
  );
};

export default PlayerBubble;
