import { EndedPhase, GameState } from "types/GameState";

import { toast } from "react-toastify";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { DocumentReference, doc } from "firebase/firestore";
import { firestore } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { GamePlayer } from "types/PlayerProfile";

const GameResult = () => {
  const { roomID } = useParams();
  const navigate = useNavigate();

  /**
   * GameState
   */
  const gameStateRef = (roomID && (doc(firestore, "gameRooms", roomID) as DocumentReference<GameState>)) || null;
  const [gameState, isLoading, error] = useDocumentData<GameState>(gameStateRef);
  console.log({ gameState });

  /**
   * Loading
   */
  if (isLoading) return <Loading />;

  /**
   * Error handling
   */
  //   if (!gameState || error) {
  //     toast.error("Error loading game result");
  //     navigate("/lobby");
  //   }

  //   if (gameState?.status !== "Ended") {
  //     toast.error("Game hasn't ended yet!");
  //     navigate("/lobby");
  //   }

  /**
   * DEVELOPMENT TESTING
   */

  const endedPhase: EndedPhase = {
    winnerTeam: {
      playerList: [
        {
          displayName: "John Cena",
          avatarID: "1",
          cards: [],
          country: "International",
          email: "",
          id: "",
          isHost: false,
          isReady: false,
          numCardsOnHand: 0,
          numOfGamesPlayed: 0,
          numOfGamesWon: 0,
          position: 0,
          numTricksWon: 0,
          roomID: "",
          team: "Defender",
        },
        {
          displayName: "Zhong Xina",
          avatarID: "1",
          cards: [],
          country: "International",
          email: "",
          id: "",
          isHost: false,
          isReady: false,
          numCardsOnHand: 0,
          numOfGamesPlayed: 0,
          numOfGamesWon: 0,
          position: 0,
          numTricksWon: 0,
          roomID: "",
          team: "Defender",
        },
      ],
    },
  };

  const playerOne = endedPhase.winnerTeam.playerList[0];
  const playerTwo = endedPhase.winnerTeam.playerList[1];

  return (
    <div className="h-100 w-100 d-flex flex-column align-items-center">
      <h1>Winners 🎉</h1>
      <div className="w-50 h-100 d-flex justify-content-around">
        <div className="h-100">
          <PlayerBox player={endedPhase["winnerTeam"].playerList[0]} />
        </div>
        <div>
          <PlayerBox player={endedPhase["winnerTeam"].playerList[1]} />
        </div>
      </div>
    </div>
  );
};

export default GameResult;

const PlayerBox = ({ player }: { player: GamePlayer }) => {
  //   const spriteList = [dino_sprite_1, dino_sprite_2, dino_sprite_3, dino_sprite_4];

  if (!player) return <div className="player-box"></div>;
  // Convert player avatarID to sprite index
  const spriteIndex = player.avatarID === null ? 0 : parseInt(player.avatarID) - 1;

  return (
    <div style={{ height: "15rem", width: "15rem", backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
      <div>
        <span>{player?.displayName}</span>
      </div>
      <img style={{ height: "6rem" }} src={""} />
    </div>
  );
};