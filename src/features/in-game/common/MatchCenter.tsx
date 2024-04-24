import { useRoom } from "../../../context/RoomContext";
import BiddingPanel from "../stages/bidding/components/BiddingPanel";
import TeammatePanel from "../stages/choosing-teammate/components/TeammatePanel";
import TrickAreaPanel from "../stages/taking-tricks/components/TrickAreaPanel";

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
