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
    <div className="flex w-full h-full px-1 pt-3">
      <div className="w-3/5 h-[95%] p-3 mx-3 flex justify-center bg-black/5">
        <RoomList />
      </div>
      <div className="w-2/5 flex flex-col items-center">
        <div>hi</div>
      </div>
    </div>
  );
};

export default Lobby;
