import { useRoom } from "../../../context/RoomContext";
import Chatbox from "../../chat/Chatbox";
import TrickMonitor from "./taking-trick/TrickMonitor";

const GameSidebar = () => {
  const { room } = useRoom();

  if (!room) {
    return null;
  }

  switch (room.status) {
    case "Bidding":
    case "Choosing Teammate":
      return <Chatbox className="h-full" />;
    case "Taking Trick":
      return (
        <div className="h-full w-full flex flex-col">
          <TrickMonitor className="h-2/6" />
          <Chatbox className="h-4/6" />
        </div>
      );

    default:
      return <></>;
  }
};

export default GameSidebar;
