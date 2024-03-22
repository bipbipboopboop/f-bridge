import { GameRoom } from "types/Room";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../../buttons/button";
import { useFunctions } from "../../../hooks/useFunctions";
import { useMediaQuery } from "react-responsive";

const RoomSettings = ({ room }: { room: GameRoom }) => {
  const { leaveGameRoom } = useFunctions();
  const navigate = useNavigate();
  const isPortrait = useMediaQuery({ orientation: "portrait" });

  const handleLeaveRoom = async () => {
    navigate("/lobby");
    setInterval(() => {}, 1);
    const success = await leaveGameRoom(room.roomID);
    if (success) {
      toast.success("You left the room!");
    }
  };

  if (isPortrait) {
    return <RoomSettingsPortrait room={room} />;
  }

  return (
    <div className="text-4xs md:text-2xs lg:text-base bg-black/10 p-4 rounded-lg h-full select-none">
      <div className="h-5/6 pt-5">
        <h4 className="sm:text-base md:text-xl font-bold mb-4">Settings</h4>
        <div className="space-y-[5%]">
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
      </div>
      <div className="h-1/6 flex flex-col-reverse">
        <Button theme="green" size={2} className="w-full" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </div>
    </div>
  );
};

const RoomSettingsPortrait = ({ room }: { room: GameRoom }) => {
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
    <div className="text-2xs md:text-2xs lg:text-base bg-black/10 p-4 rounded-lg h-full select-none grid grid-cols-2 gap-4">
      <div className="bg-black/20 hover:bg-[#006cb1] p-[5%] rounded-md">
        <span>Invite Only:</span>
        <span>{room.settings.isInviteOnly ? "True" : "False"}</span>
      </div>
      <div className="bg-black/20 hover:bg-[#006cb1] p-[5%] rounded-md">
        <span>Allow Reshuffle:</span>
        <span>{room.settings.isInviteOnly ? "True" : "False"}</span>
      </div>
      <div className="bg-black/20 hover:bg-[#006cb1] p-[5%] rounded-md">
        <span>Allow Spectator:</span>
        <span>{room.settings.isSpectatorAllowed ? "True" : "False"}</span>
      </div>
      <div className="bg-black/20 hover:bg-[#006cb1] p-[5%] rounded-md">
        <span>Wait Time:</span>
        <span>None</span>
      </div>
      <div className="bg-black/20 hover:bg-[#006cb1] p-[5%] rounded-md">
        <span>Max Bid:</span>
        <span>4</span>
      </div>
      <div className="col-span-2">
        <Button theme="green" size={2} className="w-full" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </div>
    </div>
  );
};

export default RoomSettings;
