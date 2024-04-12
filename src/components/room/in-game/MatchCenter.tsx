import { useRoom } from "../../../context/RoomContext";
import Auction from "./bidding/Auction";
import TeammatePanel from "./choosing-teammate/TeammatePanel";
import TrickArea from "./taking-trick/TrickArea";

const MatchCenter = () => {
  const { room } = useRoom();

  if (!room) {
    return null;
  }

  switch (room.status) {
    case "Bidding":
      return <Auction />;
    case "Choosing Teammate":
      return <TeammatePanel />;
    case "Taking Trick":
      return <TrickArea />;

    default:
      return <></>;
  }
};

export default MatchCenter;
