import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import RoomTable from "../tables/lobby.table";

const LobbyRooms = () => {
  return (
    <Tabs className="w-75">
      <TabList className={"tab-list"}>
        <Tab className="tab" selectedClassName="tab-active">
          Rooms
        </Tab>
        <Tab className="tab" selectedClassName="tab-active">
          Spectate
        </Tab>
      </TabList>

      <TabPanel>
        <RoomTable />
      </TabPanel>

      <TabPanel>
        <RoomTable />
      </TabPanel>
    </Tabs>
  );
};

export default LobbyRooms;
