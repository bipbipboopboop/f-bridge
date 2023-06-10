import {GameState} from "types/GameState";
import {LobbyPlayerProfile} from "types/PlayerProfile";

import PlayerPanel from "../components/party/player_panel";
import RoomSettings from "../components/party/settings";
import Chatbox from "../components/chat/chatbox";

import "./party.css";

const GameParty = () => {
  const room: GameState = {
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
      isHost: true,
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
      isHost: false,
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
      isHost: false,
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
      isHost: false,
    },
  ];

  return (
    <div className="w-100 h-100 d-flex mb-4 justify-content-center">
      <div className="game-room-left">
        <RoomSettings room={room} />
      </div>
      <div className="game-room-middle">
        <PlayerPanel players={players} />
      </div>
      <div className="game-room-right">
        <Chatbox />
      </div>
    </div>
  );
};

export default GameParty;
