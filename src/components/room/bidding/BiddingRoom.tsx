import { GameRoom } from "types/Room";
import Chatbox from "../../chat/Chatbox";
import Navbar from "../../navbar";

const BiddingRoom = ({ room }: { room: GameRoom }) => {
  return (
    <div className="h-full w-full">
      <div className="flex w-full h-full px-10">
        <div className="h-full w-2/3">Bidding</div>
        <div className="h-full w-1/3 p-4">
          <Chatbox />
        </div>
      </div>
    </div>
  );
};

export default BiddingRoom;
