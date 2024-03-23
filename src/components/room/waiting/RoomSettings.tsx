import { GameRoom } from "types/Room";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../../buttons/button";
import { useFunctions } from "../../../hooks/useFunctions";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";

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
        <h4 className="mobile-landscape:text-sm md:text-xl font-bold mb-4">Settings</h4>
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
  const [currentSettingIndex, setCurrentSettingIndex] = useState(0);

  const settings = [
    { label: "Invite Only", value: room.settings.isInviteOnly },
    { label: "Allow Reshuffle", value: room.settings.isInviteOnly },
    { label: "Allow Spectator", value: room.settings.isSpectatorAllowed },
    { label: "Wait Time", value: "None" },
    { label: "Max Bid", value: 4 },
  ];

  const handleLeaveRoom = async () => {
    navigate("/lobby");
    setInterval(() => {}, 1);
    const success = await leaveGameRoom(room.roomID);
    if (success) {
      toast.success("You left the room!");
    }
  };

  const handlePrevSetting = () => {
    setCurrentSettingIndex((prevIndex) => (prevIndex === 0 ? settings.length - 1 : prevIndex - 1));
  };

  const handleNextSetting = () => {
    setCurrentSettingIndex((prevIndex) => (prevIndex === settings.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="h-full">
      <div className="flex flex-col items-center justify-center h-2/3">
        <div className="text-lg font-bold mb-2">Settings</div>
        <div className="flex items-center">
          <button className="p-2 rounded-md bg-gray-300 hover:bg-gray-400 mr-2" onClick={handlePrevSetting}>
            &lt;
          </button>
          <div className="py-2 px-4 bg-black/5 rounded-md">
            {settings[currentSettingIndex].label}: {settings[currentSettingIndex].value.toString()}
          </div>
          <button className="p-2 rounded-md bg-gray-300 hover:bg-gray-400 ml-2" onClick={handleNextSetting}>
            &gt;
          </button>
        </div>
      </div>
      <div className="flex justify-center mb-4 items-center">
        <Button theme="orange" className="mr-4">
          Ready/Start
        </Button>
        <Button theme="green" onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </div>
    </div>
  );
};

export default RoomSettings;
