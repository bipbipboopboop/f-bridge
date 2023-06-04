import {GameRoom} from "types/GameRoom";
import PlayerPanel from "../components/gameroom/player_panel";
import {LobbyPlayerProfile} from "types/PlayerProfile";
import RoomSettings from "../components/gameroom/settings";
import Chatbox from "../components/chat/chatbox";

import "./game.room.css";

const Room = () => {
  const room: GameRoom = {
    biddingPhase: null,
    hostID: "host",
    createdAt: new Date(),
    invitedID: [],
    players: [],
    trickTakingPhase: null,

    settings: {
      isInviteOnly: false,
      isSpectatorAllowed: false,
    },
    scores: [],
    status: "Waiting",
  };

  const players: LobbyPlayerProfile[] = [
    {
      id: "1",
      email: "player1@example.com",
      displayName: "Player 1",
      country: "International",
      avatarID: "1",
      numOfGamesWon: 10,
      numOfGamesPlayed: 20,
      roomID: null,
      position: 1,
      isReady: true,
      numCardsOnHand: 5,
    },
    {
      id: "2",
      email: "player2@example.com",
      displayName: "Player 2",
      country: "International",
      avatarID: "2",
      numOfGamesWon: 5,
      numOfGamesPlayed: 15,
      roomID: null,
      position: 2,
      isReady: false,
      numCardsOnHand: 3,
    },
    {
      id: "3",
      email: "player3@example.com",
      displayName: "Player 3",
      country: "International",
      avatarID: "3",
      numOfGamesWon: 2,
      numOfGamesPlayed: 10,
      roomID: null,
      position: 3,
      isReady: true,
      numCardsOnHand: 4,
    },
    {
      id: "4",
      email: "player4@example.com",
      displayName: "Player 4",
      country: "International",
      avatarID: "4",
      numOfGamesWon: 8,
      numOfGamesPlayed: 18,
      roomID: null,
      position: 4,
      isReady: true,
      numCardsOnHand: 2,
    },
  ];

  return (
    <div className="w-100 h-100 d-flex mb-4 justify-content-center">
      <div
        className="game-room-left"
        // style={{border: "1px solid"}}
      >
        <RoomSettings room={room} />
      </div>
      <div
        className="game-room-middle"
        // style={{border: "1px solid"}}
      >
        <PlayerPanel players={players} />
      </div>
      <div
        className="game-room-right"
        // style={{border: "1px solid"}}
      >
        <Chatbox />
      </div>
    </div>
  );
};

export default Room;
