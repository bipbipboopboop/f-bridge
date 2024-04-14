import { RestrictedPlayerProvider } from "../../../context/RestrictedPlayerContext";
import { useAuth } from "../../../hooks/useAuth";
import { useScreenSize } from "../../../hooks/useScreenSize";

import GameSidebar from "./GameSidebar";
import MatchCenter from "./MatchCenter";
import PortraitLayout from "./PortraitLayout";

import MatchPeripheral from "./match-peripheral/MatchPeripheral";

const InGameRoom = () => {
  const { isDesktop, isLandscape, isPortrait } = useScreenSize();
  const { playerAccount } = useAuth();

  if (!playerAccount || !playerAccount?.roomID) {
    return null;
  }

  if (isDesktop) {
    return (
      <RestrictedPlayerProvider roomID={playerAccount?.roomID} playerID={playerAccount?.id}>
        <div className="h-full w-full flex">
          <div className="h-full w-3/4 relative">
            <MatchCenter />
            <MatchPeripheral />
          </div>
          <div className="h-full w-1/4 py-4">
            <GameSidebar />
          </div>
        </div>
      </RestrictedPlayerProvider>
    );
  }
  if (isLandscape) {
    return (
      <RestrictedPlayerProvider roomID={playerAccount?.roomID} playerID={playerAccount?.id}>
        <div className="h-full w-full relative">
          <MatchCenter />
          <MatchPeripheral />
        </div>
      </RestrictedPlayerProvider>
    );
  }
  if (isPortrait) {
    return <PortraitLayout />;
  }
  return null;
};

export default InGameRoom;
