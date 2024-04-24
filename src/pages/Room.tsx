import { useRoom } from "../context/RoomContext";

import WaitingRoom from "../features/waiting/components/WaitingRoom";
import EndedRoom from "../features/game-ended/EndedRoom";
import InGameRoom from "../features/in-game/InGameRoom";

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
