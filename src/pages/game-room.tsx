import "./game-room.css";

import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {useDocumentData} from "react-firebase-hooks/firestore";

import {firestore} from "../firebase";
import {DocumentReference, doc} from "firebase/firestore";

import {GameState} from "types/GameState";

import PlayerPanel from "../components/game-room/player-panel";
import RoomSettings from "../components/game-room/settings";
import Chatbox from "../components/chat/chatbox";
import Loading from "../components/Loading";

import {useAuth} from "../hooks/useAuth";

const GameRoom = () => {
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

  if (gameState.status === "Bidding" || gameState.status === "Taking Trick") {
    navigate(`/gameboard/${roomID}`);
  }

  return (
    <div className="w-100 h-100 d-flex mb-4 justify-content-center">
      <div className="game-room-left">
        <RoomSettings room={gameState} />
      </div>
      <div className="game-room-middle">
        <PlayerPanel gameState={gameState} />
      </div>
      <div className="game-room-right">
        <Chatbox />
      </div>
    </div>
  );
};

export default GameRoom;
