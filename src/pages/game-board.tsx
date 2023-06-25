import {GameState} from "types/GameState";
import Chatbox from "../components/chat/chatbox";
import GamePanel from "../components/game-board/game-panel";

import "./game-board.css";

import {toast} from "react-toastify";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {DocumentReference, doc} from "firebase/firestore";
import {firestore} from "../firebase";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../components/Loading";
import {useAuth} from "../hooks/useAuth";

const GameBoard = () => {
  const {roomID} = useParams();
  const navigate = useNavigate();

  // /**
  //  * PlayerProfile
  //  */
  // const {playerProfile} = useAuth();

  // /**
  //  * GameState
  //  */
  // const gameStateRef = doc(firestore, "gameRooms", roomID || "ERROR") as DocumentReference<GameState>;
  // const [gameState, isLoading, error] = useDocumentData<GameState>(gameStateRef);

  /**
   * DEVELOPMENT TESTING
   */

  const gameState: GameState = {
    createdAt: new Date(),
    settings: {
      isSpectatorAllowed: false,
      isInviteOnly: false,
    },
    invitedID: [],
    hostID: "K12clOhFoMfArqJeFK1NixWvMNKj",
    trickTakingPhase: null,
    roomID: "VLsxodGE4",
    players: [
      {
        country: "International",
        numOfGamesPlayed: 0,
        isHost: true,
        numOfGamesWon: 0,
        avatarID: null,
        displayName: "horrible-ivory",
        isReady: true,
        id: "K12clOhFoMfArqJeFK1NixWvMNKj",
        position: 0,
        email: null,
        roomID: "VLsxodGE4",
      },
      {
        country: "International",
        numOfGamesPlayed: 0,
        isHost: false,
        numOfGamesWon: 0,
        avatarID: null,
        displayName: "ugly-green",
        isReady: true,
        id: "IUqPb7wmohss5E1LRLpWj4WNw9uz",
        position: 1,
        email: null,
        roomID: null,
      },
      {
        country: "International",
        numOfGamesPlayed: 0,
        isHost: false,
        numOfGamesWon: 0,
        avatarID: null,
        displayName: "influential-bronze",
        isReady: true,
        id: "yjCMQvffpiEZMNR95gqsMbMlwUqe",
        position: 2,
        email: null,
        roomID: null,
      },
      {
        country: "International",
        numOfGamesPlayed: 0,
        isHost: false,
        numOfGamesWon: 0,
        avatarID: null,
        displayName: "puzzled-violet",
        isReady: true,
        id: "jKE0F30LwjwlV97AAxVb5j44TaxZ",
        position: 3,
        email: null,
        roomID: null,
      },
    ],
    biddingPhase: {
      currentPlayerIndex: 0,
      highestBid: null,
      bidHistory: [
        {
          p0: {
            bid: null,
            info: {
              displayName: "Player 1",
              id: "1",
            },
          },
          p1: {
            bid: null,
            info: {
              displayName: "Player 2",
              id: "2",
            },
          },
          p2: {
            bid: null,
            info: {
              displayName: "Player 3",
              id: "3",
            },
          },
          p3: {
            bid: null,
            info: {
              displayName: "Player 4",
              id: "4",
            },
          },
        },
      ],
      gameroomPlayersList: [
        {
          numCardsOnHand: 13,
          numTricksWon: 0,
          avatarID: null,
          displayName: "horrible-ivory",
          currentCardOnTable: null,
          id: "K12clOhFoMfArqJeFK1NixWvMNKj",
          position: 0,
        },
        {
          numCardsOnHand: 13,
          numTricksWon: 0,
          avatarID: null,
          displayName: "ugly-green",
          currentCardOnTable: null,
          id: "IUqPb7wmohss5E1LRLpWj4WNw9uz",
          position: 1,
        },
        {
          numCardsOnHand: 13,
          numTricksWon: 0,
          avatarID: null,
          displayName: "influential-bronze",
          currentCardOnTable: null,
          id: "yjCMQvffpiEZMNR95gqsMbMlwUqe",
          position: 2,
        },
        {
          numCardsOnHand: 13,
          numTricksWon: 0,
          avatarID: null,
          displayName: "puzzled-violet",
          currentCardOnTable: null,
          id: "jKE0F30LwjwlV97AAxVb5j44TaxZ",
          position: 3,
        },
      ],
    },
    status: "Choosing Teammate",
  };

  const playerProfile = {
    country: "International",
    numOfGamesPlayed: 0,
    numOfGamesWon: 0,
    avatarID: null,
    displayName: "horrible-ivory",
    id: "K12clOhFoMfArqJeFK1NixWvMNKj",
    email: null,
    roomID: "VLsxodGE4",
  };

  console.log({playerProfile, gameState});

  const isLoading = false;
  const error = null;

  if (isLoading) return <Loading />;
  if (!gameState) {
    toast.error("You are not allowed in this room!");
    navigate("/lobby");
    return <></>;
  }

  const isPlayerAllowedIn =
    gameState.players.some((player) => player.id === playerProfile?.id) || gameState.settings.isSpectatorAllowed;
  if (!isPlayerAllowedIn || error) {
    toast.error("You are not allowed in this room");
    navigate("/lobby");
  }

  const isPlayerInRoom = gameState.players.some((player) => player.id === playerProfile?.id);

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

export default GameBoard;
