import { toast } from "react-toastify";
import Button from "../buttons/button";
import { useFunctions } from "../../hooks/useFunctions";
import { useNavigate } from "react-router-dom";

const LobbyButtons = () => {
  const { createGameRoom } = useFunctions();
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const gameRoom = (await createGameRoom())?.data;
    if (gameRoom) {
      toast.success("Room created!");
      navigate(`/room/${gameRoom.roomID}`);
    }
  };
  return (
    <div className="h-full flex flex-col justify-end">
      <Button theme="orange" className="mb-4">
        Create Room
      </Button>
      <Button theme="green">Join Room</Button>
    </div>
  );
};

export default LobbyButtons;
