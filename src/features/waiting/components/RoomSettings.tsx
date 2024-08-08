import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFunctions } from "../../../hooks/useFunctions";
import Button from "../../../components/buttons/Button";
import { GameRoom } from "types/Room";

interface RoomSettingsProps extends React.HTMLAttributes<HTMLDivElement> {
  room: GameRoom;
}

const RoomSettings = ({ room, className, ...props }: RoomSettingsProps) => {
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
    <div className={`bg-black/10 rounded-lg flex flex-col ${className}`} {...props}>
      <h4 className="font-bold p-4 h-[10%]">Settings</h4>
      <div className="h-[80%] space-y-2 px-4">
        <div className="flex justify-between bg-black/20 hover:bg-[#006cb1] p-[5%] rounded-md">
          <span>Invite Only:</span>
          <span>{room.settings.isInviteOnly ? "True" : "False"}</span>
        </div>
        <div className="flex justify-between bg-black/20 hover:bg-[#006cb1] p-[5%] rounded-md">
          <span>Allow Reshuffle:</span>
          <span>{room.settings.isInviteOnly ? "True" : "False"}</span>
        </div>
        <div className="flex justify-between bg-black/20 hover:bg-[#006cb1] p-[5%] rounded-md">
          <span>Allow Spectator:</span>
          <span>{room.settings.isSpectatorAllowed ? "True" : "False"}</span>
        </div>
        <div className="flex justify-between bg-black/20 hover:bg-[#006cb1] p-[5%] rounded-md">
          <span>Wait Time:</span>
          <span>None</span>
        </div>
        <div className="flex justify-between bg-black/20 hover:bg-[#006cb1] p-[5%] rounded-md">
          <span>Max Bid:</span>
          <span>4</span>
        </div>
      </div>
      <div className="h-[10%] px-2 mb-5">
        <Button theme="green" size={2} className="w-full" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </div>
    </div>
  );
};

export default RoomSettings;
