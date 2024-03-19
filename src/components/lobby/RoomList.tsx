// RoomList.tsx
import { memo } from "react";
import { Tab, TabList, Tabs, TabPanel } from "../tabs/tabs";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CollectionReference, collection, orderBy, query } from "firebase/firestore";
import { firestore } from "../../firebase";
import { toast } from "react-toastify";
import Loading from "../Loading";
import RoomTable from "./RoomTable";
import { GameRoom } from "types/Room";

const RoomList = () => {
  const gameRoomsCollection = collection(firestore, `gameRooms`) as CollectionReference<GameRoom>;
  const gameRoomsQuery = query(gameRoomsCollection, orderBy("createdAt", "desc"));
  const [gameRoomList, isLoading, error] = useCollectionData(gameRoomsQuery);

  if (isLoading) return <Loading />;
  if (!gameRoomList) return <Loading />;
  if (error) toast.error(error.message);

  const openRoomList: GameRoom[] = gameRoomList.filter((room) => !room.settings.isInviteOnly);
  const spectateRoomList: GameRoom[] = gameRoomList.filter(
    (room) => room.settings.isSpectatorAllowed && !(room.status === "Waiting")
  );

  return (
    <Tabs className="w-full h-full bg-black/5 p-3 rounded">
      <TabList className="flex">
        <Tab
          className="w-1/2 py-2 text-center rounded-tl-lg text-white hover:bg-[#006cb1]"
          selectedClassName="bg-[#0567a6]"
        >
          Rooms
        </Tab>
        <Tab
          className="w-1/2 py-2 text-center rounded-tr-lg text-white hover:bg-[#006cb1]"
          selectedClassName="bg-[#0567a6]"
        >
          Spectate
        </Tab>
      </TabList>
      <TabPanel index={0} className="h-full">
        <RoomTable gameRoomList={openRoomList} />
      </TabPanel>
      <TabPanel index={1} className="h-full">
        <RoomTable gameRoomList={spectateRoomList} />
      </TabPanel>
    </Tabs>
  );
};

export default memo(RoomList);
