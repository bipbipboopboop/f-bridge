import "./lobby-rooms.css";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import RoomTable from "../tables/lobby-table";
import {GameState} from "types/GameState";

import {useCollectionData} from "react-firebase-hooks/firestore";
import {CollectionReference, collection, orderBy, query} from "firebase/firestore";
import {firestore} from "../../firebase";
import {toast} from "react-toastify";
import Loading from "../Loading";

const LobbyRooms = () => {
  const gameRoomsCollection = collection(firestore, `gameRooms`) as CollectionReference<GameState>;
  const gameRoomsQuery = query(gameRoomsCollection, orderBy("createdAt", "desc"));

  const [gameRoomList, isLoading, error] = useCollectionData<GameState>(gameRoomsQuery);

  if (isLoading) return <Loading />;
  if (!gameRoomList) return <Loading />;
  if (error) toast.error(error.message);

  const openRoomList: GameState[] = gameRoomList.filter((room) => !room.settings.isInviteOnly);

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
