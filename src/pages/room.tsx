import { useParams } from "react-router-dom";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { DocumentReference, doc } from "firebase/firestore";
import { firestore } from "../firebase";
import { GameRoom } from "types/Room";
import Loading from "../components/Loading";
import WaitingRoom from "../components/room/waiting/WaitingRoom";
import BiddingRoom from "../components/room/bidding/BiddingRoom";
import TakingTrickRoom from "../components/room/taking-trick/TakingTrickRoom";
import EndedRoom from "../components/room/ended/EndedRoom";

const Room = () => {
  const { roomID } = useParams<{ roomID: string }>();
  const gameRoomRef = (roomID && (doc(firestore, "gameRooms", roomID) as DocumentReference<GameRoom>)) || null;

  const [room, isLoading] = useDocumentData<GameRoom>(gameRoomRef);

  if (isLoading) return <Loading />;

  if (!room) return null;

  switch (room.status) {
    case "Waiting":
      return <WaitingRoom room={room} />;
    case "Bidding":
    //   return <BiddingRoom room={room} />;
    case "Taking Trick":
    //   return <TakingTrickRoom room={room} />;
    case "Ended":
    //   return <EndedRoom room={room} />;
    default:
      return <>Hi</>;
  }
};

export default Room;
