import { GameRoom } from "types/Room";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../../buttons/button";
import { useFunctions } from "../../../hooks/useFunctions";

const RoomSettings = ({ room }: { room: GameRoom }) => {
  const { leaveGameRoom } = useFunctions();
  const navigate = useNavigate();

  const handleLeaveRoom = async () => {
    navigate("/lobby");
    setInterval(() => {}, 1);
    const success = await leaveGameRoom(room.roomID);
    if (success) {
      toast.success("You left the room!");
    }
  };

  return (
    <div className="bg-black/10 p-4 rounded-lg h-full select-none">
      <div className="h-5/6 pt-5">
        <h4 className="text-xl font-bold mb-4">Settings</h4>
        <div className="space-y-2">
          <div className="flex justify-between bg-black/20 hover:bg-[#006cb1] p-5">
            <span>Invite Only:</span>
            <span>{room.settings.isInviteOnly ? "True" : "False"}</span>
          </div>
          <div className="flex justify-between bg-black/20 hover:bg-[#006cb1] p-5">
            <span>Allow Reshuffle:</span>
            <span>{room.settings.isInviteOnly ? "True" : "False"}</span>
          </div>
          <div className="flex justify-between bg-black/20 hover:bg-[#006cb1] p-5">
            <span>Allow Spectator:</span>
            <span>{room.settings.isSpectatorAllowed ? "True" : "False"}</span>
          </div>
          <div className="flex justify-between bg-black/20 hover:bg-[#006cb1] p-5">
            <span>Wait Time:</span>
            <span>None</span>
          </div>
          <div className="flex justify-between bg-black/20 hover:bg-[#006cb1] p-5">
            <span>Max Bid:</span>
            <span>4</span>
          </div>
        </div>
      </div>
      <div className="h-1/6 flex flex-col-reverse">
        <Button theme="green" size={2} className="w-full mt-4" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </div>
    </div>
  );
};

export default RoomSettings;
