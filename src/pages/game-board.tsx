import { GameRoom } from "types/GameRoom";
import Chatbox from "../components/chat/chatbox";
import GamePanel from "../components/game-board/game-panel";

import "./game-board.css";

import { toast } from "react-toastify";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { DocumentReference, doc } from "firebase/firestore";
import { firestore } from "../firebase";
import { useParams, Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../hooks/useAuth";

const GameBoard = () => {
  const { roomID } = useParams();

  /**
   * PlayerProfile
   */
  const { playerProfile } = useAuth();

  /**
   * GameRoom
   */
  const gameRoomRef = (roomID && (doc(firestore, "gameRooms", roomID) as DocumentReference<GameRoom>)) || null;
  const [gameRoom, isLoading, error] = useDocumentData<GameRoom>(gameRoomRef);

  /**
   * DEVELOPMENT TESTING
   */

  // const isLoading = false;
  // const error = null;

  console.log({ playerProfile, gameRoom });

  if (isLoading) return <Loading />;

  if (!gameRoom) {
    toast.error("You are not allowed in this room!");
    return <Navigate to={`/lobby`} />;
  }

  const isPlayerAllowedIn =
    gameRoom.players.some((player) => player.id === playerProfile?.id) || gameRoom.settings.isSpectatorAllowed;
  if (!isPlayerAllowedIn || error) {
    toast.error("You are not allowed in this room");
    return <Navigate to={`/lobby`} />;
  }

  const isPlayerInRoom = gameRoom.players.some((player) => player.id === playerProfile?.id);

  if (!isPlayerInRoom) {
    toast.error("You are not in this room!");
    return <Navigate to={`/lobby`} />;
  }

  if (gameRoom.status === "Ended") {
    return <Navigate to={`/result/${roomID}`} />;
  }

  if (!["Bidding", "Choosing Teammate", "Taking Trick"].includes(gameRoom.status)) return <>404</>;

  return (
    <div className="game-component">
      <div className="left">
        <GamePanel gameRoom={gameRoom} />
      </div>

      <div className="right">
        <div className="top">
          <Chatbox />
        </div>
        {/* <div className="bottom">
          <GameRoomInfo gameRoom={gameRoom} />
        </div> */}
      </div>
    </div>
  );
};

export default GameBoard;
