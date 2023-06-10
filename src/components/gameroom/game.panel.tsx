import GreenButton from "../buttons/button.green";
import Hand from "./hand";
import PlayerBubble from "./player_bubble";
import PlayingArea from "./playing_area";

import "./game.panel.css";
import {GameRoom} from "types/GameRoom";
import {GameRoomPlayer} from "types/PlayerProfile";

const GamePanel = () => {
  const players: GameRoomPlayer[] = [
    {
      avatarID: "1",
      displayName: "Player 1",
      id: "0",
      numCardsOnHand: 13,
      position: 0,
      currentCardOnTable: null,
      numTricksWon: 0,
    },
    {
      avatarID: "2",
      displayName: "Player 2",
      id: "1",
      numCardsOnHand: 13,
      position: 1,
      currentCardOnTable: null,
      numTricksWon: 0,
    },
    {
      avatarID: "3",
      displayName: "Player 3",
      id: "2",
      numCardsOnHand: 13,
      position: 2,
      currentCardOnTable: null,
      numTricksWon: 0,
    },
    {
      avatarID: "4",
      displayName: "Player 4",
      id: "3",
      numCardsOnHand: 13,
      position: 3,
      currentCardOnTable: null,
      numTricksWon: 0,
    },
  ];

  const gameInfo: GameRoom = {
    biddingPhase: null,
    createdAt: new Date(),
    hostID: "123",
    invitedID: [],
    players: [],
    settings: {
      isInviteOnly: false,
      isSpectatorAllowed: false,
    },
    status: "Taking Trick",
    trickTakingPhase: {
      currentPlayerIndex: 0,
      leadPlayerIndex: 0,
      trumpSuit: "NT",
      gameroomPlayersList: players,
    },
  };

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

        <PlayingArea />

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
