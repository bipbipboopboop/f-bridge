import { useAuth } from "../../hooks/useAuth";
import { useBiddingPhase } from "../../context/BiddingContext";
import { useRestrictedPlayerData } from "../../context/RestrictedPlayerContext";
import PlayingCard from "../PlayingCard";
import MatchAvatar from "./MatchAvatar";
import PlayerHand from "./PlayerHand";

const MatchPeripheral: React.FC = () => {
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
      <PlayerHand restrictedPlayer={restrictedPlayer} isCurrentPlayer={currentPlayerId === playerAccount?.id} />

      <MatchAvatar position={westPlayerPosition} className="absolute top-1/4 left-10" />
      <MatchAvatar position={northPlayerPosition} className="absolute top-5 left-28" />
      <MatchAvatar position={eastPlayerPosition} className="absolute top-1/4 right-10" />
      <MatchAvatar position={currentPlayerPosition} className="absolute bottom-[16%] right-10" />

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
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center -space-x-[5%]">
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

export default MatchPeripheral;
