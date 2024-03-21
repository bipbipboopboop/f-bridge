import WaitingRoom from "../components/room/waiting/WaitingRoom";
import BiddingRoom from "../components/room/bidding/BiddingRoom";
import TakingTrickRoom from "../components/room/taking-trick/TrickTakingRoom";
import EndedRoom from "../components/room/ended/EndedRoom";
import { useRoom } from "../context/RoomContext";
import TeammateChoosingRoom from "../components/room/choosing-teammate/TeammateChoosingRoom";

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
    case "Choosing Teammate":
      return <TeammateChoosingRoom />;
    case "Taking Trick":
      return <TakingTrickRoom />;
    case "Ended":
    //   return <EndedRoom room={room} />;
    default:
      return <>Hi</>;
  }
};

export default Room;
