import { useRoom } from "../../../context/RoomContext";
import BiddingPanel from "./bidding/BiddingPanel";
import TeammatePanel from "./choosing-teammate/TeammatePanel";
import TrickAreaPanel from "./taking-trick/TrickAreaPanel";

const MatchCenter = () => {
  const { room } = useRoom();

  if (!room) {
    return null;
  }

  switch (room.status) {
    case "Bidding":
      return <BiddingPanel />;
    case "Choosing Teammate":
      return <TeammatePanel />;
    case "Taking Trick":
      return <TrickAreaPanel />;

    default:
      return <></>;
  }
};

export default MatchCenter;
