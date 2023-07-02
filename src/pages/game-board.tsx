import { GameState } from "types/GameState";
import Chatbox from "../components/chat/chatbox";
import GamePanel from "../components/game-board/game-panel";

import "./game-board.css";

import { toast } from "react-toastify";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { DocumentReference, doc } from "firebase/firestore";
import { firestore } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../hooks/useAuth";

const GameBoard = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();

  /**
   * PlayerProfile
   */
  const { playerProfile } = useAuth();

  /**
   * GameState
   */
  const gameStateRef = doc(firestore, "gameRooms", roomID || "ERROR") as DocumentReference<GameState>;
  const [gameState, isLoading, error] = useDocumentData<GameState>(gameStateRef);

  /**
   * DEVELOPMENT TESTING
   */

  // const gameState: GameState = {
  //   createdAt: new Date(),
  //   settings: {
  //     isSpectatorAllowed: false,
  //     isInviteOnly: false,
  //   },
  //   invitedID: [],
  //   hostID: "4bTcgc3TyJ7oxb7QlYHYFiAI8X1E",
  //   trickTakingPhase: null,
  //   roomID: "An28rz5Jc",
  //   players: [
  //     {
  //       country: "International",
  //       numOfGamesPlayed: 0,
  //       isHost: true,
  //       numOfGamesWon: 0,
  //       avatarID: null,
  //       displayName: "other-tan",
  //       isReady: true,
  //       id: "4bTcgc3TyJ7oxb7QlYHYFiAI8X1E",
  //       position: 0,
  //       email: null,
  //       roomID: "An28rz5Jc",
  //     },
  //     {
  //       country: "International",
  //       numOfGamesPlayed: 0,
  //       isHost: false,
  //       numOfGamesWon: 0,
  //       avatarID: null,
  //       displayName: "mental-amaranth",
  //       isReady: true,
  //       id: "LuqFI9HmssfllRzRBwe4l1LzPQ73",
  //       position: 1,
  //       email: null,
  //       roomID: null,
  //     },
  //     {
  //       country: "International",
  //       numOfGamesPlayed: 0,
  //       isHost: false,
  //       numOfGamesWon: 0,
  //       avatarID: null,
  //       displayName: "grumpy-purple",
  //       isReady: true,
  //       id: "5nbM6VFyy9FLZpSOEQlc18znR2jY",
  //       position: 2,
  //       email: null,
  //       roomID: null,
  //     },
  //     {
  //       country: "International",
  //       numOfGamesPlayed: 0,
  //       isHost: false,
  //       numOfGamesWon: 0,
  //       avatarID: null,
  //       displayName: "awful-blush",
  //       isReady: true,
  //       id: "SJfR7VXcVQBuMejoI8KqwnslvVXP",
  //       position: 3,
  //       email: null,
  //       roomID: null,
  //     },
  //   ],
  //   biddingPhase: {
  //     currentPlayerIndex: 0,
  //     highestBid: null,
  //     bidHistory: [
  //       {
  //         p0: {
  //           bid: null,
  //           info: {
  //             displayName: "Player 1",
  //             id: "1",
  //           },
  //         },
  //         p1: {
  //           bid: null,
  //           info: {
  //             displayName: "Player 2",
  //             id: "2",
  //           },
  //         },
  //         p2: {
  //           bid: null,
  //           info: {
  //             displayName: "Player 3",
  //             id: "3",
  //           },
  //         },
  //         p3: {
  //           bid: null,
  //           info: {
  //             displayName: "Player 4",
  //             id: "4",
  //           },
  //         },
  //       },
  //     ],
  //     numPasses: 0,
  //     gameroomPlayersList: [
  //       {
  //         numCardsOnHand: 13,
  //         numTricksWon: 0,
  //         avatarID: null,
  //         displayName: "other-tan",
  //         currentCardOnTable: null,
  //         id: "4bTcgc3TyJ7oxb7QlYHYFiAI8X1E",
  //         position: 0,
  //       },
  //       {
  //         numCardsOnHand: 13,
  //         numTricksWon: 0,
  //         avatarID: null,
  //         displayName: "mental-amaranth",
  //         currentCardOnTable: null,
  //         id: "LuqFI9HmssfllRzRBwe4l1LzPQ73",
  //         position: 1,
  //       },
  //       {
  //         numCardsOnHand: 13,
  //         numTricksWon: 0,
  //         avatarID: null,
  //         displayName: "grumpy-purple",
  //         currentCardOnTable: null,
  //         id: "5nbM6VFyy9FLZpSOEQlc18znR2jY",
  //         position: 2,
  //       },
  //       {
  //         numCardsOnHand: 13,
  //         numTricksWon: 0,
  //         avatarID: null,
  //         displayName: "awful-blush",
  //         currentCardOnTable: null,
  //         id: "SJfR7VXcVQBuMejoI8KqwnslvVXP",
  //         position: 3,
  //       },
  //     ],
  //   },
  //   status: "Bidding",
  // };

  // const playerProfile = {
  //   country: "International",
  //   numOfGamesPlayed: 0,
  //   numOfGamesWon: 0,
  //   avatarID: null,
  //   displayName: "other-tan",
  //   id: "4bTcgc3TyJ7oxb7QlYHYFiAI8X1E",
  //   email: null,
  //   roomID: "An28rz5Jc",
  // };

  // const isLoading = false;
  // const error = null;

  console.log({ playerProfile, gameState });

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
