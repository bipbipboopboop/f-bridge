import { GameRoom } from "types/Room";
import PlayerBox from "./PlayerBox";
import RoomButtonPanel from "./RoomButtonPanel";

const PlayerPanel = ({ room }: { room: GameRoom }) => {
  const { players } = room;

  return (
    <div className="bg-black/10 p-4 rounded-lg h-full w-full">
      <div className="h-5/6 pt-5">
        <h4 className="text-xl">Players</h4>
        <div className="h-full flex flex-col items-center justify-center">
          <div className="flex justify-around w-full">
            <PlayerBox player={players[0]} />
            <PlayerBox player={players[1]} />
          </div>
          <div className="flex justify-around w-full">
            <PlayerBox player={players[2]} />
            <PlayerBox player={players[3]} />
          </div>
        </div>
      </div>
      <div className="h-1/6">
        <RoomButtonPanel room={room} />
      </div>
    </div>
  );
};

export default PlayerPanel;
