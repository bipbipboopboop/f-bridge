import { avatarLookup } from "assets/avatar";
import { useAuth } from "../../../hooks/useAuth";
import { useRoom } from "../../../context/RoomContext";
import { useMediaQuery } from "react-responsive";

const AuctionAvatarRow = () => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();
  const isDesktop = useMediaQuery({ minWidth: 915 });
  const isLandscape = useMediaQuery({ orientation: "landscape" }) && !isDesktop;
  const isPortrait = !isDesktop && !isLandscape;

  if (!room || !room.phase.biddingPhase) {
    return null;
  }

  const { players } = room;
  const { currentPlayerIndex } = room.phase.biddingPhase;

  const portraitAvatarSize = "h-8";
  const landscapeAvatarSize = "h-3";
  const desktopAvatarSize = "h-10";

  return (
    <div className="grid grid-cols-4 gap-y-1 justify-items-center items-center select-none">
      {players.map((player, index) => {
        const avatar = avatarLookup[player.avatarID];
        const avatarSize = isDesktop
          ? desktopAvatarSize
          : isLandscape
          ? landscapeAvatarSize
          : isPortrait
          ? portraitAvatarSize
          : desktopAvatarSize;

        return (
          <div
            key={player.id}
            className={`${index === currentPlayerIndex ? "border-b-4 border-orange-400 h-full py-1" : ""}`}
          >
            <div className="text-2xs md:text-xs text-center select-none">
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
