import "./game-party.css";

import { toast } from "react-toastify";
import { Navigate, useParams } from "react-router-dom";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { firestore } from "../firebase";
import { DocumentReference, doc } from "firebase/firestore";

import { GameRoom } from "types/GameRoom";

import PlayerPanel from "../components/game-room/player-panel";
import RoomSettings from "../components/game-room/settings";
import Chatbox from "../components/chat/chatbox";
import Loading from "../components/Loading";

import { useAuth } from "../hooks/useAuth";

const GameParty = () => {
  const { roomID } = useParams();
  const { playerProfile } = useAuth();

  const roomRef = doc(firestore, "gameRooms", roomID || "ERROR") as DocumentReference<GameRoom>;
  const [gameRoom, isLoading, error] = useDocumentData<GameRoom>(roomRef);

  if (isLoading) return <Loading />;
  if (!gameRoom) {
    toast.error("You are not allowed in this room!");
    return <Navigate to="/lobby" />;
  }

  const isPlayerAllowedIn =
    gameRoom.players.some((player) => player.id === playerProfile?.id) || gameRoom.settings.isSpectatorAllowed;
  if (!isPlayerAllowedIn || error) {
    toast.error("You are not allowed in this room");
    return <Navigate to="/lobby" />;
  }

  if (gameRoom.status === "Bidding" || gameRoom.status === "Taking Trick") {
    return <Navigate to={`/gameboard/${roomID}`} />;
  }

  return (
    <div className="w-100 h-100 d-flex mb-4 justify-content-center">
      <div className="game-room-left">
        <RoomSettings room={gameRoom} />
      </div>
      <div className="game-room-middle">
        <PlayerPanel gameRoom={gameRoom} />
      </div>
      <div className="game-room-right">
        <Chatbox />
      </div>
    </div>
  );
};

export default GameParty;
