import {GameState} from "types/GameState";
import Chatbox from "../components/chat/chatbox";
import GamePanel from "../components/gameroom/game.panel";

import "./gameroom.css";
import GameStateInfo from "../components/gameroom/game_state_info/gamestate.info";
import {toast} from "react-toastify";

const GameRoomComponent = () => {
  // TODO: Get from cloud function
  const gameState: GameState = {
    hostID: "0",
    createdAt: new Date(),
    settings: {
      isInviteOnly: false,
      isSpectatorAllowed: false,
    },
    invitedID: [],

    status: "Bidding",
    players: [
      {
        avatarID: "0",
        displayName: "Player 1",
        id: "0",
        country: "US",
        position: 0,
        email: "email",
        isHost: false,
        isReady: true,
        numOfGamesPlayed: 1,
        numOfGamesWon: 0,
        roomID: "roomID",
      },
      {
        avatarID: "1",
        displayName: "Player 2",
        id: "1",
        country: "US",
        position: 1,
        email: "email",
        isHost: false,
        isReady: true,
        numOfGamesPlayed: 1,
        numOfGamesWon: 0,
        roomID: "roomID",
      },
      {
        avatarID: "3",
        displayName: "Player 3",
        id: "2",
        country: "US",
        position: 2,
        email: "email",
        isHost: false,
        isReady: true,
        numOfGamesPlayed: 1,
        numOfGamesWon: 0,
        roomID: "roomID",
      },
      {
        avatarID: "4",
        displayName: "Player 4",
        id: "3",
        country: "US",
        position: 3,
        email: "email",
        isHost: false,
        isReady: true,
        numOfGamesPlayed: 1,
        numOfGamesWon: 0,
        roomID: "roomID",
      },
    ],

    biddingPhase: {
      gameroomPlayersList: [
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
      ],

      currentBidderIndex: 0,
      highestBid: {number: 1, suit: "♣"},
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

    // trickTakingPhase: {
    //   currentPlayerIndex: 0,
    //   leadPlayerIndex: 0,
    //   trumpSuit: "♠",
    //   gameroomPlayersList: [
    //     {
    //       avatarID: "1",
    //       displayName: "Player 1",
    //       id: "1",
    //       numCardsOnHand: 13,
    //       position: 0,
    //       currentCardOnTable: {stringValue: "A", suit: "♠", value: 14},
    //       numTricksWon: 0,
    //     },
    //     {
    //       displayName: "Player 2",
    //       id: "2",
    //       avatarID: "2",
    //       numCardsOnHand: 13,
    //       position: 1,
    //       currentCardOnTable: {stringValue: "K", suit: "♠", value: 13},
    //       numTricksWon: 0,
    //     },
    //     {
    //       displayName: "Player 3",
    //       id: "3",
    //       avatarID: "3",
    //       numCardsOnHand: 13,
    //       position: 2,
    //       currentCardOnTable: {stringValue: "Q", suit: "♠", value: 12},
    //       numTricksWon: 0,
    //     },
    //     {
    //       displayName: "Player 4",
    //       id: "4",
    //       avatarID: "4",
    //       numCardsOnHand: 13,
    //       position: 3,
    //       currentCardOnTable: {stringValue: "J", suit: "♠", value: 11},
    //       numTricksWon: 0,
    //     },
    //   ],
    // },
    trickTakingPhase: null,
  };

  // TODO: Obtain playerID from AuthContext
  const playerID = "0";
  const isPlayerInRoom =
    gameState.players.filter((player) => player.id === playerID).length > 0;

  if (!isPlayerInRoom) {
    toast.error("You are not in this room!");
    return <>404</>;
  }
  if (gameState.status === "Waiting") return <>404</>;

  return (
    <div className="game-component">
      <div className="left">
        <GamePanel gameState={gameState} />
      </div>

      <div className="right">
        <div className="top">
          <Chatbox />
        </div>
        {/* <div className="bottom">
          <GameStateInfo gameState={gameState} />
        </div> */}
      </div>
    </div>
  );
};

export default GameRoomComponent;
