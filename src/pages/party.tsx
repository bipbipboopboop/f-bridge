import {GameState} from "types/GameState";
import {LobbyPlayerProfile} from "types/PlayerProfile";

import PlayerPanel from "../components/party/player_panel";
import RoomSettings from "../components/party/settings";
import Chatbox from "../components/chat/chatbox";

import "./party.css";
import {firestore} from "../firebase";
import {DocumentReference, doc} from "firebase/firestore";
import {useParams} from "react-router-dom";
import {useDocumentData} from "react-firebase-hooks/firestore";
import Loading from "../components/loading";
import {toast} from "react-toastify";

const GameParty = () => {
  const {roomID} = useParams();
  const roomRef = doc(firestore, "gameRooms", roomID || "ERROR") as DocumentReference<GameState>;
  const [gameState, isLoading, error] = useDocumentData<GameState>(roomRef);

  if (isLoading) return <Loading />;
  if (!gameState) return <>404</>;

  if (error) {
    toast.error(error.message);
    return <>404</>;
  }

  return (
    <div className="w-100 h-100 d-flex mb-4 justify-content-center">
      <div className="game-room-left">
        <RoomSettings room={gameState} />
      </div>
      <div className="game-room-middle">
        <PlayerPanel players={gameState.players} />
      </div>
      <div className="game-room-right">
        <Chatbox />
      </div>
    </div>
  );
};

export default GameParty;
