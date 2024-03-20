import { useAuth } from "../../../hooks/useAuth";
import { useBiddingPhase } from "../../../context/BiddingContext";
import { useRestrictedPlayerData } from "../../../context/RestrictedPlayerContext";

const Hands: React.FC = () => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const { restrictedPlayer } = useRestrictedPlayerData();
  const { biddingPhase } = useBiddingPhase();

  if (!biddingPhase || !restrictedPlayer) {
    return null;
  }

  const currentPlayerPosition = biddingPhase.players.find((player) => player.id === currentPlayerId)!
    .position as number;
  const westPlayerPosition = (currentPlayerPosition + 3) % 4;
  const northPlayerPosition = (currentPlayerPosition + 2) % 4;
  const eastPlayerPosition = (currentPlayerPosition + 1) % 4;

  console.log({ currentPlayerPosition, westPlayerPosition, northPlayerPosition, eastPlayerPosition });

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {/* Current Player */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center -space-x-[12%]">
          {restrictedPlayer.cards.map((card, index) => (
            <div
              key={index}
              className="w-[100px] h-[123px] bg-white rounded-2xl text-black border border-indigo-600 p-3"
              style={{ zIndex: 40 - index * 2 }}
            >
              {card.suit} {card.rank}
            </div>
          ))}
        </div>
      </div>

      {/* West Player */}
      <div className="absolute top-1/3 left-[22%]">
        <div className="flex relative">
          {Array.from({
            length: biddingPhase.players.find((player) => player.position === westPlayerPosition)?.numCardsOnHand || 0,
          }).map((_, index) => (
            <div
              key={index}
              className="absolute w-[100px] h-[123px] bg-green-200 rounded-2xl text-black border border-indigo-600 p-3"
              style={{
                top: `${Math.floor(index / 4) * 68}px`,
                right: `${(index % 4) * 40}px`,
                zIndex: 40 - index * 2,
              }}
            >
              Hi
            </div>
          ))}
        </div>
      </div>

      {/* North Player */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center -space-x-[12%]">
          {Array.from({
            length: biddingPhase.players.find((player) => player.position === northPlayerPosition)?.numCardsOnHand || 0,
          }).map((_, index) => (
            <div
              key={index}
              className="w-[100px] h-[123px] bg-[rgba(0,0,0,0.18)] rounded-2xl bg-green-200 border border-indigo-600"
            ></div>
          ))}
        </div>
      </div>

      {/* East Player */}
      <div className="absolute top-1/3 right-[22%]">
        <div className="flex relative">
          {Array.from({
            length: biddingPhase.players.find((player) => player.position === eastPlayerPosition)?.numCardsOnHand || 0,
          }).map((_, index) => (
            <div
              key={index}
              className="absolute w-[100px] h-[123px] bg-green-200 rounded-2xl text-black border border-indigo-600 p-3"
              style={{
                top: `${Math.floor(index / 4) * 68}px`,
                left: `${(index % 4) * 40}px`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hands;
