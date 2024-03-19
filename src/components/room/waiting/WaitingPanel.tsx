import { GameRoom } from "types/Room";
import PlayerPanel from "./PlayerPanel";
import RoomSettings from "./RoomSettings";

const WaitingPanel = ({ room }: { room: GameRoom }) => {
  return (
    <div className="flex h-full w-100">
      <div className="w-2/5">
        <RoomSettings room={room} />
      </div>
      <div className="w-3/5 mx-6">
        <PlayerPanel room={room} />
      </div>
    </div>
  );
};

export default WaitingPanel;
