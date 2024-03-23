/**
 * COMPONENTS
 */
import Navbar from "../components/navbar";
import RoomList from "../components/lobby/RoomList";
import LobbyButtons from "../components/lobby/LobbyButtons";
import LobbyAvatar from "../components/lobby/LobbyAvatar";

/**
 * CONTEXT
 */
import { LobbyProvider } from "../context/LobbyContext";

/**
 * HOOKS
 */
import { useMediaQuery } from "react-responsive";

const Lobby = () => {
  const isDesktop = useMediaQuery({ minWidth: 915 }); // Adjust the breakpoint as needed
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
      <div className="h-[90%] p-3 mx-3 flex justify-center bg-black/5 overflow-x-auto">
        <RoomList />
      </div>
      <div className="w-2/5 h-[90%] flex flex-col items-center">
        <div className="h-full">
          <div className="h-2/3 flex flex-col justify-center">
            <LobbyAvatar />
          </div>
          <div className="h-1/3 flex flex-col-reverse">
            <LobbyButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

const LobbyMobilePortrait = () => {
  return (
    <div className="flex flex-col h-full items-center">
      <div className="h-[20%] flex flex-col items-center">
        <LobbyButtons />
      </div>
      <div className="h-[80%] w-[70%] p-3 mx-3 flex justify-center bg-black/5 overflow-x-auto">
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
        <div className="h-full">
          <div className="h-2/3 flex flex-col justify-center">
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
