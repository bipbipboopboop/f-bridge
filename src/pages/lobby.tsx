import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * HOOKS
 */
import { useAuth } from "../hooks/useAuth";
import { useFunctions } from "../hooks/useFunctions";

/**
 * COMPONENTS
 */
import Button from "../components/buttons/button";
import RoomList from "../components/lobby/RoomList";

import LobbyPlayerCard from "../components/lobby/lobby-player-card";

const Lobby = () => {
  const { playerAccount } = useAuth();
  const { createGameRoom } = useFunctions();
  const navigate = useNavigate();

  if (!playerAccount) return <></>;

  const handleCreateRoom = async () => {
    const gameRoom = (await createGameRoom())?.data;
    if (gameRoom) {
      toast.success("Room created!");
      navigate(`/room/${gameRoom.roomID}`);
    }
  };

  return (
    <div className="flex w-100 px-1 pt-3">
      <div className="w-3/5 px-5 flex justify-center">
        <RoomList />
      </div>
      <div className="w-2/5 flex flex-col items-center">
        <div>hi</div>
      </div>
      {/* <div className="w-1/4 p-3 flex flex-col justify-between">
        <LobbyPlayerCard playerAccount={playerAccount} />
        <div className="p-3 py-5">
          <p>Join A Room! (Coming Soon)</p>
          <input type="text" className="h-12 w-full" />
          <Button theme="green" className="mr-2">
            Join Room
          </Button>
        </div>
        <div className="flex flex-col p-3 space-y-5">
          <div className="flex justify-center">
            {playerAccount.roomID ? (
              <Button theme="orange" onClick={() => navigate(`/party/${playerAccount.roomID}`)}>
                Back to room
              </Button>
            ) : (
              <Button theme="orange" onClick={handleCreateRoom}>
                Create Room
              </Button>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Lobby;
