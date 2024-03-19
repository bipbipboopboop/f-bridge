// RoomList.tsx
import { memo } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
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
    <div className="w-full h-full bg-black/5 p-3 rounded">
      <Tabs className="h-full flex flex-col">
        <TabList className="flex p-0">
          <Tab
            className="w-100 flex-grow py-2 text-center rounded-tl-lg text-white bg-[#006cb1] hover:bg-[#006cb1]"
            selectedClassName="bg-[#0567a6]"
          >
            Rooms
          </Tab>
          <Tab
            className="w-100 flex-grow py-2 text-center rounded-tr-lg text-white bg-[#006cb1] hover:bg-[#006cb1]"
            selectedClassName="bg-[#0567a6]"
          >
            Spectate
          </Tab>
        </TabList>
        <TabPanel className="flex-grow rounded overflow-hidden">
          <RoomTable gameRoomList={openRoomList} />
        </TabPanel>
        <TabPanel className="flex-grow rounded overflow-hidden">
          <RoomTable gameRoomList={spectateRoomList} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default memo(RoomList);
