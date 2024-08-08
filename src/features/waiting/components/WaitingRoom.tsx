import WaitingPanel from "./WaitingPanel";
import Chatbox from "../../../components/chat/Chatbox";
import Navbar from "../../../components/Navbar";

import { GameRoom } from "types/Room";

const WaitingRoom = ({ room }: { room: GameRoom }) => {
  return (
    <div className="h-screen w-screen">
      <Navbar className="h-[10%] md:h-[5%]" />

      <div className="h-[90%] md:h-[95%] flex pb-5 px-3">
        <div className="h-full w-2/3 pl-4 py-4">
          <WaitingPanel room={room} />
        </div>
        <Chatbox className="h-full w-1/3 pr-4 py-4" />
      </div>
    </div>
  );
};

export default WaitingRoom;
