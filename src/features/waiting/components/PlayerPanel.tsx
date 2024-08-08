import { GameRoom } from "types/Room";
import PlayerBox from "./PlayerBox";
import RoomButtonPanel from "./RoomButtonPanel";

interface PlayerPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  room: GameRoom;
}

const PlayerPanel = ({ room, className, ...props }: PlayerPanelProps) => {
  const { players } = room;

  return (
    <div className={`bg-black/10 rounded-lg flex flex-col ${className}`} {...props}>
      <h4 className="font-bold p-4 h-[10%]">Players</h4>
      <div className="h-[80%] px-4">
        <div className="grid grid-rows-2 grid-cols-2 gap-1">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex items-center justify-center">
              <PlayerBox player={players[index]} />
            </div>
          ))}
        </div>
      </div>
      <div className="h-[10%] px-2 mb-5">
        <RoomButtonPanel room={room} />
      </div>
    </div>
  );
};

export default PlayerPanel;
