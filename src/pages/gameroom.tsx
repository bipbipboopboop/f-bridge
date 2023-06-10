import {GameRoom} from "types/GameRoom";
import Chatbox from "../components/chat/chatbox";
import GamePanel from "../components/gameroom/game.panel";

import "./gameroom.css";
import GameStateInfo from "../components/gameroom/game_state_info/gamestate.info";
import {GameRoomPlayer} from "types/PlayerProfile";

const GameRoomComponent = () => {
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
    hostID: "123",
    createdAt: new Date(),
    settings: {
      isInviteOnly: false,
      isSpectatorAllowed: false,
    },
    invitedID: [],

    status: "Bidding",
    players: [],

    biddingPhase: {
      gameroomPlayersList: players,

      currentBidderIndex: 0,
      highestBid: null,
      bidHistory: [
        {
          p0: {bid: null, info: {displayName: "Player 1", id: "0"}},
          p1: {
            bid: {number: 1, suit: "♣"},
            info: {displayName: "Player 2", id: "1"},
          },
          p2: {bid: null, info: {displayName: "Player 3", id: "2"}},
          p3: {bid: null, info: {displayName: "Player 4", id: "3"}},
        },
        {
          p0: {bid: null, info: {displayName: "Player 1", id: "0"}},
          p1: {bid: null, info: {displayName: "Player 2", id: "1"}},
          p2: {bid: null, info: {displayName: "Player 3", id: "2"}},
          p3: {bid: null, info: {displayName: "Player 4", id: "3"}},
        },
        {
          p0: {bid: null, info: {displayName: "Player 1", id: "0"}},
          p1: {bid: null, info: {displayName: "Player 2", id: "1"}},
          p2: {bid: null, info: {displayName: "Player 3", id: "2"}},
          p3: {bid: null, info: {displayName: "Player 4", id: "3"}},
        },
        {
          p0: {bid: null, info: {displayName: "Player 1", id: "0"}},
          p1: {bid: null, info: {displayName: "Player 2", id: "1"}},
          p2: {bid: null, info: {displayName: "Player 3", id: "2"}},
          p3: {bid: null, info: {displayName: "Player 4", id: "3"}},
        },
        {
          p0: {bid: null, info: {displayName: "Player 1", id: "0"}},
          p1: {bid: null, info: {displayName: "Player 2", id: "1"}},
          p2: {bid: null, info: {displayName: "Player 3", id: "2"}},
          p3: {bid: null, info: {displayName: "Player 4", id: "3"}},
        },
      ],
    },

    trickTakingPhase: {
      currentPlayerIndex: 0,
      leadPlayerIndex: 0,
      trumpSuit: "NT",
      gameroomPlayersList: players,
    },
  };

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
