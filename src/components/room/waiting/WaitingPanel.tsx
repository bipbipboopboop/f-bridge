import { useMediaQuery } from "react-responsive";

import { GameRoom } from "types/Room";

import PlayerPanel from "./PlayerPanel";
import RoomSettings from "./RoomSettings";

const WaitingPanel = ({ room }: { room: GameRoom }) => {
  const isDesktop = useMediaQuery({ minWidth: 915, orientation: "landscape" });
  const isLandscape = useMediaQuery({ orientation: "landscape" });

  if (isDesktop || isLandscape) return <WaitingPanelWeb room={room} />;
  return <WaitingPanelPortrait room={room} />;
};

const WaitingPanelWeb = ({ room }: { room: GameRoom }) => {
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

const WaitingPanelPortrait = ({ room }: { room: GameRoom }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-[60%] w-full px-4">
        <PlayerPanel room={room} />
      </div>
      <div className="h-[40%] w-full px-4">
        <RoomSettings room={room} />
      </div>
    </div>
  );
};

export default WaitingPanel;
