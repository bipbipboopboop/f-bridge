import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../../../hooks/useAuth";
import { useRoom } from "../../../../context/RoomContext";
import useScreenSize from "../../../../hooks/useScreenSize";

const AuctionAvatarRow = () => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();
  const { isDesktop } = useScreenSize();

  if (!room || !room.phase.biddingPhase) {
    return null;
  }

  const { players } = room;
  const { currentPlayerIndex } = room.phase.biddingPhase;

  const landscapeAvatarSize = "h-4";
  const desktopAvatarSize = "h-10";

  return (
    <div className="text-2xs grid grid-cols-4 gap-y-1 justify-items-center items-center select-none h-full relative bottom-[30%]">
      {players.map((player, index) => {
        const avatar = avatarLookup[player.avatarID];
        const avatarSize = isDesktop ? desktopAvatarSize : landscapeAvatarSize;

        return (
          <div
            key={player.id}
            className={`${index === currentPlayerIndex ? "border-b-4 border-orange-400 h-full py-1" : ""}`}
          >
            <div className="text-center select-none">
              {player.id === playerAccount?.id ? "You" : `P${player.position}`}
            </div>
            <img src={avatar} className={avatarSize} alt="avatar" />
          </div>
        );
      })}
    </div>
  );
};

export default AuctionAvatarRow;
