import { EndedPhase, GameRoom } from "types/GameRoom";

import { toast } from "react-toastify";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { DocumentReference, doc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { GamePlayer } from "types/PlayerProfile";
import { avatarLookup } from "assets/avatar";

const GameResult = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();

  /**
   * GameRoom
   */
  const gameRoomRef = (roomID && (doc(firestore, "gameRooms", roomID) as DocumentReference<GameRoom>)) || null;
  const [gameRoom, isLoading, error] = useDocumentData<GameRoom>(gameRoomRef);
  console.log({ gameRoom });

  /**
   * Loading
   */
  if (isLoading) return <Loading />;

  /**
   * Error handling
   */
  if (!gameRoom || error) {
    toast.error("Error loading game result");
    return <Navigate to="/lobby" />;
  }

  if (gameRoom?.status !== "Ended") {
    toast.error("Game hasn't ended yet!");
    return <Navigate to={`/gameroom/${roomID}`} />;
  }

  if (!gameRoom.endedPhase) {
    toast.error("Game hasn't ended yet!");
    return <Navigate to={`/gameroom/${roomID}`} />;
  }

  const endedPhase = gameRoom.endedPhase;

  /**
   * DEVELOPMENT TESTING
   */

  // const endedPhase: EndedPhase = {
  //   winnerTeam: {
  //     playerList: [
  //       {
  //         displayName: "John Cena",
  //         avatarID: "blueDino",
  //         cards: [],
  //         country: "International",
  //         email: "",
  //         id: "",
  //         isHost: false,
  //         isReady: false,
  //         numCardsOnHand: 0,
  //         numOfGamesPlayed: 0,
  //         numOfGamesWon: 0,
  //         position: 0,
  //         numTricksWon: 0,
  //         roomID: "",
  //         team: "Defender",
  //       },
  //       {
  //         displayName: "Zhong Xina",
  //         avatarID: "blueDino",
  //         cards: [],
  //         country: "International",
  //         email: "",
  //         id: "",
  //         isHost: false,
  //         isReady: false,
  //         numCardsOnHand: 0,
  //         numOfGamesPlayed: 0,
  //         numOfGamesWon: 0,
  //         position: 0,
  //         numTricksWon: 0,
  //         roomID: "",
  //         team: "Defender",
  //       },
  //     ],
  //   },
  // };

  const playerOne = endedPhase.winnerTeam.playerList[0];
  const playerTwo = endedPhase.winnerTeam.playerList[1];

  return (
    <div className="h-100 w-100 d-flex flex-column align-items-center">
      <div className="h-25">
        <h1>Winners 🎉</h1>
      </div>
      <div className="w-50 h-75 d-flex justify-content-around">
        <div>
          <PlayerBox player={playerOne} />
          <PlayerResult player={playerOne} />
        </div>
        <div>
          <PlayerBox player={playerTwo} />
          <PlayerResult player={playerTwo} />
        </div>
      </div>
      <div className="h-25">
        <div className="d-flex justify-content-around">It was a hard fought game!</div>
      </div>
    </div>
  );
};

export default GameResult;

const PlayerBox = ({ player }: { player: GamePlayer }) => {
  if (!player) return <div className="player-box"></div>;

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "15rem", width: "15rem", marginBottom: "2rem", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div>
        <img style={{ height: "12rem" }} src={avatarLookup[player.avatarID]} />
      </div>
      <div>
        <span>{player?.displayName}</span>
      </div>
    </div>
  );
};

const PlayerResult = ({ player }: { player: GamePlayer }) => {
  return (
    <div style={{ width: "15rem" }}>
      <div className="py-3 px-1 my-2" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
        Tricks Won: {player.numTricksWon}
      </div>
    </div>
  );
};
