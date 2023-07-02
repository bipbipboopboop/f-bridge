import { GameRoomPlayer } from "types/PlayerProfile";
import dino_sprite_1 from "assets/player_assets/dino_sprite_1.gif";
import "./player-bubble.css";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  player: GameRoomPlayer;
  currentPlayerIndex: 0 | 1 | 2 | 3;
  location: "top" | "bottom" | "left" | "right";
};

const PlayerBubble = (props: Props) => {
  const { player, currentPlayerIndex, location } = props;
  const isPlayerTurn = currentPlayerIndex === player.position;
  const { playerProfile } = useAuth();

  const isMe = playerProfile?.id === player.id;
  if (location === "top") {
    return (
      <div className={`player-bubble-${location} ${isPlayerTurn ? "selected" : "waiting"}`}>
        <div className="d-flex justify-content-center" style={{ fontSize: "0.5rem", color: isMe ? "yellow" : "white" }}>
          {player.displayName}
        </div>
        <div className="d-flex align-items-center">
          <img src={dino_sprite_1} alt={":/"} />
          <div className="d-flex flex-column w-100 align-items-center">
            <PlayerNumCardHint numCardsOnHand={player.numCardsOnHand} />
            <PlayerNumTricksWon numCardsWon={player.numTricksWon} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`player-bubble-${location} ${isPlayerTurn ? "selected" : "waiting"}`}>
      <div className="d-flex justify-content-center" style={{ fontSize: "0.5rem", color: isMe ? "yellow" : "white" }}>
        {player.displayName}
      </div>
      <div className="d-flex flex-column align-items-center">
        <img src={dino_sprite_1} alt={":/"} />
        <div className="d-flex w-100 justify-content-around">
          <PlayerNumCardHint numCardsOnHand={player.numCardsOnHand} />
          <PlayerNumTricksWon numCardsWon={player.numTricksWon} />
        </div>
      </div>
    </div>
  );
};

export default PlayerBubble;

const PlayerNumCardHint = (props: { numCardsOnHand: number }) => {
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

const PlayerNumTricksWon = (props: { numCardsWon: number }) => {
  return (
    <div className="d-flex align-items-center justify-content-around">
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "darkblue",
          color: "white",
          height: "40px",
          width: "30px",
          borderRadius: "5px",
        }}
      />
      &nbsp;{props.numCardsWon}
    </div>
  );
};
