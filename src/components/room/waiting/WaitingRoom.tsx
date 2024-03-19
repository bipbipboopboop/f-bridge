import { GameRoom } from "types/Room";
import WaitingPanel from "./WaitingPanel";
import Chatbox from "../../chat/chatbox";
import Navbar from "../../navbar";

const WaitingRoom = ({ room }: { room: GameRoom }) => {
  return (
    <>
      <Navbar />
      <div className="flex w-full h-full px-20">
        <div className="w-2/3 p-4">
          <WaitingPanel room={room} />
        </div>
        <div className="w-1/3 p-4">
          <Chatbox />
        </div>
      </div>
    </>
  );
};

export default WaitingRoom;
