import { GameRoom } from "types/GameRoom";
import GreenButton from "../buttons/button-green";
import { useAuth } from "../../hooks/useAuth";
import useFunctions from "../../hooks/useFunctions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const RoomSettings = ({ room }: { room: GameRoom }) => {
  const { playerProfile } = useAuth();
  const { leaveGameRoom } = useFunctions();
  const navigate = useNavigate();
  return (
    <>
      <h4>Settings</h4>
      <div className="w-100">
        <div className="tab">{`Invite Only: ${room.settings.isInviteOnly}`}</div>
        <div className="tab">{`Allow Reshuffle: ${room.settings.isInviteOnly}`}</div>
        <div className="tab">{`Allow Spectator: ${room.settings.isSpectatorAllowed}`}</div>
        <div className="tab">Wait Time: None</div>
        <div className="tab">Max Bid: 4</div>
        <GreenButton
          style={{ width: "100%" }}
          onClick={async () => {
            navigate("/lobby");
            setInterval(() => {}, 1);
            const success = await leaveGameRoom(playerProfile?.roomID);

            if (success) {
              toast.success(`You left the room!`);
            }
          }}
        >
          Leave Room
        </GreenButton>
      </div>
    </>
  );
};

export default RoomSettings;
