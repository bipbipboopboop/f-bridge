import {GameRoom} from "types/GameRoom";
import Chatbox from "../components/chat/chatbox";
import GamePanel from "../components/gameroom/game.panel";

import "./gameroom.css";
import GameStateInfo from "../components/gameroom/game_state_info/gamestate.info";

const GameRoomComponent = () => {
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
      scores: [],
      leadPlayerIndex: 0,
      trumpSuit: "NT",
      currentTrick: [],
    },
  };

  // const gameInfo: GameRoom = {
  //   biddingPhase: {
  //     bidHistory: [],
  //     currentBidderIndex: 0,
  //     highestBid: null,
  //     numBidsMade: 0,
  //   },
  //   createdAt: new Date(),
  //   hostID: "123",
  //   invitedID: [],
  //   players: [],
  //   settings: {
  //     isInviteOnly: false,
  //     isSpectatorAllowed: false,
  //   },
  //   status: "Taking Trick",
  //   trickTakingPhase: null,
  // };

  return (
    <div className="game-component">
      <div className="left">
        <GamePanel />
      </div>
      <div className="right">
        <div className="top">
          <Chatbox />
        </div>
        <div className="bottom">
          <GameStateInfo gameroom={gameInfo} />
        </div>
      </div>
    </div>
  );
};

export default GameRoomComponent;
