import { GameRoom } from "types/Room";
import PlayerBox from "./PlayerBox";
import RoomButtonPanel from "./RoomButtonPanel";
import { useMediaQuery } from "react-responsive";

const PlayerPanel = ({ room }: { room: GameRoom }) => {
  const { players } = room;
  const isDesktop = useMediaQuery({ minWidth: 915 });
  const isLandscape = useMediaQuery({ orientation: "landscape" }) && !isDesktop;
  const isPortrait = !isDesktop && !isLandscape;

  const containerClasses = `bg-black/10 rounded-lg h-full w-full ${isDesktop ? "p-4" : isLandscape ? "p-4" : "p-1"}`;

  const headingClasses = `text-xl ${isLandscape ? "text-xs mb-4" : isPortrait ? "text-sm" : ""}`;

  return (
    <div className={containerClasses}>
      <div className="h-5/6 pt-5 mobile-portrait:h-full">
        <h4 className={headingClasses}>Players</h4>
        <div className="grid grid-rows-2 grid-cols-2 h-5/6">
          {[0, 1, 2, 3].map((index) => (
            <div className="justify-self-center self-center">
              <PlayerBox player={players[index]} />
            </div>
          ))}
        </div>
      </div>
      {!isPortrait && (
        <div className="h-1/6">
          <RoomButtonPanel room={room} />
        </div>
      )}
    </div>
  );
};

export default PlayerPanel;
