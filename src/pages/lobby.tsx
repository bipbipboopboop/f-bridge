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
import LobbyRoom from "../components/new_lobby/LobbyRoom";

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
    <div className="flex h-screen">
      <div className="w-1/2">
        <div className="flex justify-center">
          <LobbyRoom />
        </div>
      </div>
      <div className="w-1/4 p-3 flex flex-col justify-between">
        <LobbyPlayerCard playerAccount={playerAccount} />
        <div className="p-3 py-5 bg-gray-100">
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
      </div>
    </div>
  );
};

export default Lobby;
