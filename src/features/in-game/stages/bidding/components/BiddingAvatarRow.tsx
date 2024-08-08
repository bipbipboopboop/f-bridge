import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../../../../hooks/useAuth";
import { useRoom } from "../../../../../context/RoomContext";

const AuctionAvatarRow = () => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();

  if (!room || !room.phase.biddingPhase) {
    return null;
  }

  const { players } = room;
  const { currentPlayerIndex } = room.phase.biddingPhase;

  return (
    <div className="text-2xs md:text-xs grid grid-cols-4 gap-y-1 justify-items-center items-center select-none h-full">
      {players.map((player, index) => {
        const avatar = avatarLookup[player.avatarID];

        return (
          <div
            key={player.id}
            className={`h-full flex flex-col justify-end ${
              index === currentPlayerIndex ? "border-b-2 md:border-b-4 border-orange-400" : ""
            }`}
          >
            <div className="text-center select-none">
              {player.id === playerAccount?.id ? "You" : `P${player.position}`}
            </div>
            <img src={avatar} className="h-4 md:h-10 max-h-4 md:max-h-10 relative bottom-1" alt="avatar" />
          </div>
        );
      })}
    </div>
  );
};

export default AuctionAvatarRow;
