import { avatarLookup } from "assets/avatar";
import { useBiddingPhase } from "../../../context/BiddingContext";
import { useAuth } from "../../../hooks/useAuth";

const AuctionAvatarRow = () => {
  const { playerAccount } = useAuth();
  const { biddingPhase } = useBiddingPhase();
  if (!biddingPhase) {
    return null;
  }
  const { players, currentPlayerIndex } = biddingPhase;
  return (
    <div className="grid-cols-4 gap-y-1 grid justify-items-center items-center">
      {players.map((player, index) => {
        const avatar = avatarLookup[player.avatarID];
        return (
          <div
            key={player.id}
            className={`${index === currentPlayerIndex ? "border-b-4 border-orange-400 h-full py-1" : ""}`}
          >
            <div className="text-xs text-center">{player.id === playerAccount?.id ? "You" : `P${player.position}`}</div>
            <img src={avatar} className="h-10" />
          </div>
        );
      })}
    </div>
  );
};
export default AuctionAvatarRow;
