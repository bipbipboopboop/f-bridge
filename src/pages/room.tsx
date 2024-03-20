import { Navigate, useParams } from "react-router-dom";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { DocumentReference, doc } from "firebase/firestore";
import { firestore } from "../firebase";
import { GameRoom } from "types/Room";
import Loading from "../components/Loading";
import WaitingRoom from "../components/room/waiting/WaitingRoom";
import BiddingRoom from "../components/room/bidding/BiddingRoom";
import TakingTrickRoom from "../components/room/taking-trick/TakingTrickRoom";
import EndedRoom from "../components/room/ended/EndedRoom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useFunctions } from "../hooks/useFunctions";

const Room = () => {
  const { roomID } = useParams<{ roomID: string }>();
  const { playerAccount } = useAuth();
  const { joinGameRoom } = useFunctions();

  const gameRoomRef = (roomID && (doc(firestore, "gameRooms", roomID) as DocumentReference<GameRoom>)) || null;
  const [room, isLoading] = useDocumentData<GameRoom>(gameRoomRef);

  if (isLoading) return <Loading />;
  if (!room) {
    toast.error("Your room is not found");
    return <Navigate to="/lobby" />;
  }

  const isPlayerInRoom = room.players.some((player) => player.id === playerAccount?.id);
  if (!isPlayerInRoom) {
    const success = joinGameRoom(roomID);
    if (!success) {
      return <Navigate to="/lobby" />;
    }
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
