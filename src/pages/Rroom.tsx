import { useRoom } from "../context/RoomContext";

import WaitingRoom from "../components/room/waiting/WaitingRoom";
import EndedRoom from "../components/room/ended/EndedRoom";
import InGameRoom from "../components/room/in-game/InGameRoom";

const Room = () => {
  const { room } = useRoom();

  if (!room) {
    return null;
  }

  switch (room.status) {
    case "Waiting":
      return <WaitingRoom room={room} />;
    case "Bidding":
    case "Choosing Teammate":
    case "Taking Trick":
      return <InGameRoom />;
    case "Ended":
      return <EndedRoom />;
    default:
      return <></>;
  }
};

export default Room;
