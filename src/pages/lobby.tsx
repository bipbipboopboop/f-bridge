import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * HOOKS
 */
import { useAuth } from "../hooks/useAuth";
import useFunctions from "../hooks/useFunctions";

/**
 * COMPONENTS
 */
import GreenButton from "../components/buttons/button-green";
import LobbyRooms from "../components/lobby/lobby-rooms";
import LobbyPlayerCard from "../components/lobby/lobby-player-card";

import Loading from "../components/Loading";
import Button from "../components/buttons/button";

const Lobby = () => {
  const { playerAccount } = useAuth();
  const { createGameRoom, error, isLoading } = useFunctions();
  const navigate = useNavigate();

  if (!playerAccount) return <></>;
  if (isLoading) return <Loading />;

  if (error) {
    toast.error(error.message);
  }

  return (
    <div className="w-100 h-100 d-flex">
      <div className="w-75 p-3">
        <div className="d-flex justify-content-center">
          <LobbyRooms />
        </div>
      </div>
      <div className="w-50 h-100 p-3 d-flex flex-column justify-content-between">
        <LobbyPlayerCard playerAccount={playerAccount} />
        <div className="p-3 py-5" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
          <p>Join A Room! (Coming Soon)</p>
          <input type="text" style={{ height: "52px" }} />
          <GreenButton style={{ marginRight: "0.5rem" }}>Join Room</GreenButton>
        </div>
        <div className="d-flex flex-column p-3" style={{ gap: "20px" }}>
          <div className="d-flex justify-content-center">
            {playerAccount.roomID && (
              <Button
                theme="orange"
                onClick={() => {
                  navigate(`/party/${playerAccount.roomID}`);
                }}
              >
                Back to room
              </Button>
            )}
            {!playerAccount.roomID && (
              <Button
                theme="orange"
                onClick={async () => {
                  const gameRoom = (await createGameRoom())?.data;
                  if (gameRoom) {
                    toast.success("Room created!");
                    navigate(`/party/${gameRoom.roomID}`);
                  }
                }}
              >
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
