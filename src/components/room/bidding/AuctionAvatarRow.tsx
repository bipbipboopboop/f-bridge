import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../../hooks/useAuth";
import { useRoom } from "../../../context/RoomContext";

const AuctionAvatarRow = () => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();

  if (!room || !room.phase.biddingPhase) {
    return null;
  }

  const { players } = room;
  const { currentPlayerIndex } = room.phase.biddingPhase;

  return (
    <div className="grid-cols-4 gap-y-1 grid justify-items-center items-center select-none">
      {players.map((player, index) => {
        const avatar = avatarLookup[player.avatarID];
        return (
          <div
            key={player.id}
            className={`${index === currentPlayerIndex ? "border-b-4 border-orange-400 h-full py-1" : ""}`}
          >
            <div className="text-xs text-center select-none">
              {player.id === playerAccount?.id ? "You" : `P${player.position}`}
            </div>
            <img src={avatar} className="h-10" />
          </div>
        );
      })}
    </div>
  );
};
export default AuctionAvatarRow;
