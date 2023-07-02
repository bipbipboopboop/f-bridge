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
  const gameStateRef = (roomID && (doc(firestore, "gameRooms", roomID) as DocumentReference<GameState>)) || null;
  const [gameState, isLoading, error] = useDocumentData<GameState>(gameStateRef);

  /**
   * DEVELOPMENT TESTING
   */

  // const isLoading = false;
  // const error = null;

  console.log({ playerProfile, gameState });

  if (isLoading) return <Loading />;

  if (!gameState) {
    toast.error("You are not allowed in this room!");
    navigate("/lobby");
    return <>404</>;
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

  if (!["Bidding", "Choosing Teammate", "Taking Trick"].includes(gameState.status)) return <>404</>;

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
