import {GameState} from "types/GameState";
import Chatbox from "../components/chat/chatbox";
import GamePanel from "../components/game-board/game-panel";

import "./game-board.css";

import {toast} from "react-toastify";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {DocumentReference, doc} from "firebase/firestore";
import {firestore} from "../firebase";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../components/loading";
import {useAuth} from "../hooks/useAuth";

const GameBoard = () => {
  const {roomID} = useParams();
  const {playerProfile} = useAuth();
  const navigate = useNavigate();

  const roomRef = doc(firestore, "gameRooms", roomID || "ERROR") as DocumentReference<GameState>;
  const [gameState, isLoading, error] = useDocumentData<GameState>(roomRef);

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

  // console.log({gameState});

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
