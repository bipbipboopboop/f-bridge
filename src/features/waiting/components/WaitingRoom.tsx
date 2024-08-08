import Chatbox from "../../../components/chat/Chatbox";
import Navbar from "../../../components/Navbar";
import { GameRoom } from "types/Room";
import RoomSettings from "./RoomSettings";
import PlayerPanel from "./PlayerPanel";

const WaitingRoom = ({ room }: { room: GameRoom }) => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar className="h-[10%] md:h-[5%]" />
      <div className="h-[90%] md:h-[95%] flex p-4 space-x-4 text-2xs md:text-xs lg:text-base">
        <RoomSettings room={room} className="w-1/4 h-full" />
        <PlayerPanel room={room} className="w-2/5 h-full" />
        <Chatbox className="w-1/3 h-full" />
      </div>
    </div>
  );
};

export default WaitingRoom;
