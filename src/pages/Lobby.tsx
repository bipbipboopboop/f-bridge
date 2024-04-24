/**
 * COMPONENTS
 */
import Navbar from "../components/Navbar";
import RoomList from "../features/lobby/components/RoomList";
import LobbyButtons from "../features/lobby/components/LobbyButtons";
import LobbyAvatar from "../features/lobby/components/LobbyAvatar";

/**
 * CONTEXT
 */
import { LobbyProvider } from "../features/lobby/context/LobbyContext";

/**
 * HOOKS
 */
import { useMediaQuery } from "react-responsive";

const Lobby = () => {
  const isDesktop = useMediaQuery({ minWidth: 930 });
  const isLandscape = useMediaQuery({ orientation: "landscape" });
  return (
    <LobbyProvider>
      <Navbar />
      {isDesktop ? <LobbyWeb /> : isLandscape ? <LobbyMobileLandscape /> : <LobbyMobilePortrait />}
    </LobbyProvider>
  );
};

// Just LobbyWeb but scaled down for mobile
const LobbyMobileLandscape = () => {
  return (
    <div className="flex w-full h-full px-1 pt-3">
      <div className="h-[90%] w-3/5 p-3 mx-3 flex justify-center bg-black/5 overflow-x-auto">
        <RoomList />
      </div>
      <div className="w-2/5 h-[90%] flex flex-col items-center">
        <div className="h-2/3 w-full flex flex-col justify-center">
          <LobbyAvatar className="h-full" />
        </div>
        <div className="h-1/3 flex flex-col-reverse">
          <LobbyButtons />
        </div>
      </div>
    </div>
  );
};

const LobbyMobilePortrait = () => {
  return (
    <div className="flex flex-col h-full w-full items-center">
      <div className="h-[10%] flex items-center justify-center">
        <LobbyButtons />
      </div>
      <div className="h-[90%] w-[90%] p-3 mx-3 flex justify-center bg-black/5 overflow-x-auto">
        <RoomList />
      </div>
    </div>
  );
};

const LobbyWeb = () => {
  return (
    <div className="flex w-full h-full px-1 pt-3">
      <div className="w-3/5 h-[95%] p-3 mx-3 flex justify-center bg-black/5">
        <RoomList />
      </div>
      <div className="w-2/5 h-[95%] flex flex-col items-center">
        <div className="h-full w-full flex flex-col justify-center">
          <div className="h-2/3 w-full flex flex-col justify-center">
            <LobbyAvatar className="h-full" />
          </div>
          <div className="h-1/3 flex flex-col-reverse">
            <LobbyButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
