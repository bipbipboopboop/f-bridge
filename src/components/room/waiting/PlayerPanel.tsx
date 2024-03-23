import { GameRoom } from "types/Room";
import PlayerBox from "./PlayerBox";
import RoomButtonPanel from "./RoomButtonPanel";
import { useMediaQuery } from "react-responsive";

const PlayerPanel = ({ room }: { room: GameRoom }) => {
  const { players } = room;
  const isDesktop = useMediaQuery({ minWidth: 915 });
  const isLandscape = useMediaQuery({ orientation: "landscape" }) && !isDesktop;
  const isPortrait = !isDesktop && !isLandscape;

  if (isPortrait)
    return (
      <div className="bg-black/10 p-4 rounded-lg h-full w-full mobile-portrait:p-1">
        <div className="h-5/6 pt-5">
          <h4 className="text-xl mobile-portrait:text-sm mobile-landscape:text-sm mobile-landscape:mb-4">Players</h4>
          <div className="h-full grid grid-rows-2 grid-cols-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`flex justify-center items-center ${index < 2 ? "items-end" : "items-start"}`}
              >
                <PlayerBox player={players[index]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-black/10 p-4 rounded-lg h-full w-full mobile-portrait:p-1">
      <div className="h-5/6 pt-5">
        <h4 className="text-xl mobile-portrait:text-sm mobile-landscape:text-sm mobile-landscape:mb-4">Players</h4>
        <div className="h-full grid grid-rows-2 grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className={`flex justify-center items-center ${index < 2 ? "items-end" : "items-start"}`}>
              <PlayerBox player={players[index]} />
            </div>
          ))}
        </div>
      </div>
      <div className="h-1/6">
        <RoomButtonPanel room={room} />
      </div>
    </div>
  );
};

export default PlayerPanel;
