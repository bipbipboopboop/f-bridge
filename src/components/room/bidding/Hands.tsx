import { useAuth } from "../../../hooks/useAuth";
import { useBiddingPhase } from "../../../context/BiddingContext";
import { useRestrictedPlayerData } from "../../../context/RestrictedPlayerContext";
import PlayingCard from "../../PlayingCard";

const Hands: React.FC = () => {
  const { playerAccount } = useAuth();
  const { restrictedPlayer } = useRestrictedPlayerData();
  const { biddingPhase } = useBiddingPhase();

  const currentPlayerId = playerAccount?.id;

  if (!biddingPhase || !restrictedPlayer) {
    return null;
  }

  const currentPlayerPosition = biddingPhase.players.find((player) => player.id === currentPlayerId)!
    .position as number;
  const westPlayerPosition = (currentPlayerPosition + 3) % 4;
  const northPlayerPosition = (currentPlayerPosition + 2) % 4;
  const eastPlayerPosition = (currentPlayerPosition + 1) % 4;

  return (
    <div className="top-0 left-0 w-full h-full">
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center -space-x-[12%]">
          {restrictedPlayer.cards.map((card, index) => (
            <PlayingCard
              key={index}
              card={card}
              style={{ zIndex: 40 - index * 2 }}
              className="cursor-pointer transition-transform duration-300 ease-in-out hover:transform hover:-translate-y-8"
              onClick={() => {
                alert(card.rank + card.suit);
              }}
            />
          ))}
        </div>
      </div>
      {/* West Player */}
      <div className="absolute top-1/3 left-[22%]">
        <div className="flex relative">
          {Array.from({
            length: biddingPhase.players.find((player) => player.position === westPlayerPosition)?.numCardsOnHand || 0,
          }).map((_, index) => (
            <PlayingCard
              key={index}
              isFlipDown
              style={{
                position: "absolute",
                top: `${Math.floor(index / 4) * 68}px`,
                right: `${(index % 4) * 40}px`,
                zIndex: 40 - index * 2,
              }}
            />
          ))}
        </div>
      </div>
      {/* North Player */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center -space-x-[12%]">
          {Array.from({
            length: biddingPhase.players.find((player) => player.position === northPlayerPosition)?.numCardsOnHand || 0,
          }).map((_, index) => (
            <PlayingCard key={index} isFlipDown />
          ))}
        </div>
      </div>
      {/* East Player */}
      <div className="absolute top-1/3 right-[22%]">
        <div className="flex relative">
          {Array.from({
            length: biddingPhase.players.find((player) => player.position === eastPlayerPosition)?.numCardsOnHand || 0,
          }).map((_, index) => (
            <PlayingCard
              key={index}
              isFlipDown
              style={{
                position: "absolute",
                top: `${Math.floor(index / 4) * 68}px`,
                left: `${(index % 4) * 40}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hands;
