import "./lobby-rooms.css";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import RoomTable from "../tables/lobby.table";
import {GameState} from "types/GameState";

const LobbyRooms = () => {
  // TOOD: Get from useHttpsCallable
  const gameRoomList: GameState[] = [
    {
      hostID: "Host 1",
      createdAt: new Date(),
      settings: {
        isInviteOnly: false,
        isSpectatorAllowed: false,
      },
      invitedID: [],
      status: "Waiting",
      players: [
        {
          displayName: "Player 1",
          country: "International",
          avatarID: "2",
          email: "hi@email.com",
          id: "1",
          isReady: true,
          isHost: false,
          numOfGamesPlayed: 0,
          numOfGamesWon: 0,
          position: 0,
          roomID: "1",
        },
        {
          displayName: "Player 1",
          country: "International",
          avatarID: "1",
          email: "hi@email.com",
          id: "1",
          isReady: true,
          isHost: false,
          numOfGamesPlayed: 0,
          numOfGamesWon: 0,
          position: 0,
          roomID: "1",
        },
      ],
      biddingPhase: null,
      trickTakingPhase: null,
    },
    {
      hostID: "Host 2",
      createdAt: new Date(),
      settings: {
        isInviteOnly: false,
        isSpectatorAllowed: false,
      },
      invitedID: [],
      status: "Waiting",
      players: [],
      biddingPhase: null,
      trickTakingPhase: null,
    },
  ];

  const openRoomList: GameState[] = gameRoomList.filter(
    (room) => !room.settings.isInviteOnly
  );

  const spectateRoomList: GameState[] = gameRoomList.filter(
    (room) => room.settings.isSpectatorAllowed && !(room.status === "Waiting")
  );

  return (
    <Tabs className="w-75">
      <TabList className="tab-list">
        <Tab className="tab" selectedClassName="tab-active">
          Rooms
        </Tab>
        <Tab className="tab" selectedClassName="tab-active">
          Spectate
        </Tab>
      </TabList>

      <TabPanel>
        <RoomTable gameRoomList={openRoomList} />
      </TabPanel>

      <TabPanel>
        <RoomTable gameRoomList={spectateRoomList} />
      </TabPanel>
    </Tabs>
  );
};

export default LobbyRooms;
