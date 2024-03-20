import WaitingRoom from "../components/room/waiting/WaitingRoom";
import BiddingRoom from "../components/room/bidding/BiddingRoom";
import TakingTrickRoom from "../components/room/taking-trick/TakingTrickRoom";
import EndedRoom from "../components/room/ended/EndedRoom";
import { useRoom } from "../context/RoomContext";

const Room = () => {
  const { room } = useRoom();

  if (!room) {
    return null;
  }

  switch (room.status) {
    case "Waiting":
      return <WaitingRoom room={room} />;
    case "Bidding":
      return <BiddingRoom />;
    case "Taking Trick":
    //   return <TakingTrickRoom room={room} />;
    case "Ended":
    //   return <EndedRoom room={room} />;
    default:
      return <>Hi</>;
  }
};

export default Room;
