/**
 * COMPONENTS
 */
import Navbar from "../components/navbar";
import RoomList from "../components/lobby/RoomList";

/**
 * CONTEXT
 */
import { LobbyProvider } from "../context/LobbyContext";
import LobbyButtons from "../components/lobby/LobbyButtons";
import LobbyAvatar from "../components/lobby/LobbyAvatar";

const Lobby = () => {
  return (
    <LobbyProvider>
      <Navbar />
      <div className="flex w-full h-full px-1 pt-3">
        <div className="w-3/5 h-[95%] p-3 mx-3 flex justify-center bg-black/5">
          <RoomList />
        </div>
        <div className="w-2/5 h-[95%] flex flex-col items-center">
          <div className="h-full">
            <div className="h-2/3">
              <LobbyAvatar />
            </div>
            <div className="h-1/3">
              <LobbyButtons />
            </div>
          </div>
        </div>
      </div>
    </LobbyProvider>
  );
};

export default Lobby;
