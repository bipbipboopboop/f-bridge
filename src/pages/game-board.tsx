import {GameState} from "types/GameState";
import Chatbox from "../components/chat/chatbox";
import GamePanel from "../components/game-board/game-panel";

import "./game-board.css";
// import GameStateInfo from "../components/gameroom/game_state_info/gamestate.info";
import {toast} from "react-toastify";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {DocumentReference, doc} from "firebase/firestore";
import {firestore} from "../firebase";
import {useParams} from "react-router-dom";
import Loading from "../components/loading";

const GameRoomComponent = () => {
  const {roomID} = useParams();
  const roomRef = doc(firestore, "rooms", roomID || "ERROR") as DocumentReference<GameState>;
  const [gameState, isLoading, error] = useDocumentData<GameState>(roomRef);

  if (isLoading) return <Loading />;
  if (!gameState) return <Loading />;

  if (error) {
    toast.error(error.message);
    return <>404</>;
  }

  console.log({gameState});

  // TODO: Obtain playerID from AuthContext
  const playerID = "0";
  const isPlayerInRoom = gameState.players.filter((player) => player.id === playerID).length > 0;

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
