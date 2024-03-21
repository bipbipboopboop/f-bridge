// RoomList.tsx
import { memo } from "react";
import { Tab, TabList, Tabs, TabPanel } from "../tabs/tabs";
import RoomTable from "./RoomTable";

import { useRoomList } from "../../context/LobbyContext";

const RoomList = () => {
  const { roomList } = useRoomList();

  const openRoomList = roomList.filter((room) => !room.settings.isInviteOnly);
  const spectateRoomList = roomList.filter((room) => room.settings.isSpectatorAllowed && !(room.status === "Waiting"));

  return (
    <Tabs className="w-full h-full bg-black/5 p-3 rounded">
      <TabList className="flex">
        <Tab
          className="w-1/2 py-2 text-center rounded-tl-lg text-white hover:bg-[#006cb1]"
          selectedClassName="bg-[#0567a6]"
        >
          Public Rooms
        </Tab>
        <Tab
          className="w-1/2 py-2 text-center rounded-tr-lg text-white hover:bg-[#006cb1]"
          selectedClassName="bg-[#0567a6]"
        >
          Invite Only
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
