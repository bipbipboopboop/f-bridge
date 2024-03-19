import { GameRoom } from "types/Room";
import WaitingPanel from "./WaitingPanel";
import Chatbox from "../../chat/Chatbox";
import Navbar from "../../navbar";

const WaitingRoom = ({ room }: { room: GameRoom }) => {
  return (
    <div className="h-full">
      <div className="h-[5%]">
        <Navbar />
      </div>
      <div className="flex w-full h-[95%] px-10">
        <div className="h-full w-2/3 p-4">
          <WaitingPanel room={room} />
        </div>
        <div className="h-full w-1/3 p-4">
          <Chatbox />
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
