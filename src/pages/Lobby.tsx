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

const Lobby = () => {
  return (
    <LobbyProvider>
      <Navbar className="h-[10%] md:h-[5%]" />

      <div className="h-[90%] md:h-[95%] flex pb-5 px-3">
        <div className="w-3/5 h-full max-h-full overflow-scroll mx-3 bg-black/5 rounded">
          <RoomList />
        </div>
        <div className="w-2/5">
          <div className="h-2/3 w-full flex flex-col justify-center">
            <LobbyAvatar className="h-full" />
          </div>
          <div className="h-1/3 flex flex-col-reverse">
            <LobbyButtons />
          </div>
        </div>
      </div>

      {/* <div className="flex w-full h-full px-1 pb-3">
        <div className="w-3/5 h-full p-3 mx-3 flex justify-center bg-black/5">
          <RoomList />
        </div>
        <div className="w-2/5 h-full">
          <div className="h-full w-full">
            <div className="h-2/3 w-full flex flex-col justify-center">
              <LobbyAvatar className="h-full" />
            </div>
            <div className="h-1/3 flex flex-col-reverse">
              <LobbyButtons />
            </div>
          </div>
        </div>
      </div> */}
    </LobbyProvider>
  );
};

export default Lobby;
