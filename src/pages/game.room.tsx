import GreenButton from "../components/buttons/button.green";
import OrangeButton from "../components/buttons/button.orange";
import {GameRoom} from "types/GameRoom";
import PlayerPanel from "../components/gameroom/player_panel";
import {LobbyPlayerProfile} from "types/PlayerProfile";
import RoomSettings from "../components/gameroom/settings";

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
      numOfGamesWon: 8,
      numOfGamesPlayed: 18,
      roomID: null,
      position: 4,
      isReady: true,
      numCardsOnHand: 2,
    },
  ];

  return (
    <div className="w-100 h-100 d-flex justify-content-around">
      <div className="h-100 w-50 p-5" style={{border: "1px solid"}}>
        <RoomSettings room={room} />
      </div>
      <div className="h-100 w-100 p-5" style={{border: "1px solid"}}>
        <div style={{height: "90%"}}>
          <PlayerPanel players={players} />
        </div>
        <div className="d-flex" style={{height: "10%"}}>
          <OrangeButton>Start Game</OrangeButton>
        </div>
      </div>
      <div className="h-100 w-100 p-5" style={{border: "1px solid"}}>
        <h4>Chat</h4>
        <div style={{height: "90%", border: "1px solid"}}></div>
        <div className="d-flex" style={{height: "10%", border: "1px solid"}}>
          <input
            type="text"
            className="h-100 w-75"
            style={{fontSize: "0.5rem"}}
          />
          <GreenButton>Send</GreenButton>
        </div>
      </div>
    </div>
  );
};

export default Room;
