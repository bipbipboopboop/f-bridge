import React from "react";

import { avatarLookup } from "assets/avatar";

import { useAuth } from "../../../hooks/useAuth";
import { useBiddingPhase } from "../../../context/BiddingContext";
import { useRestrictedPlayerData } from "../../../context/RestrictedPlayerContext";

const Auction: React.FC = () => {
  const { biddingPhase } = useBiddingPhase();

  if (!biddingPhase) {
    return null; // Or display a loading state
  }

  const { currentPlayerIndex, numPasses, highestBid, bidHistory, players } = biddingPhase;

  return (
    <div className="flex justify-center items-center h-full">
      <div className="p-6 max-w-[500px] min-w-[300px] w-full rounded-md bg-orange-400 shadow-xl">
        <div className="grid-cols-4 gap-y-1 pb-2.5 grid border-b border-solid border-[#e8e8e8] justify-items-center items-center">
          {players.map((player, index) => {
            const avatar = avatarLookup[player.avatarID];
            return (
              <div
                key={player.id}
                className={`${index === currentPlayerIndex ? "border-2 border-solid border-[#e4e0d8]" : ""}`}
              >
                <img src={avatar} />
              </div>
            );
          })}
        </div>
        <div className="text-center py-5">Start Auction</div>
        <div className="border-t border-solid border-[#e8e8e8] pt-2.5 mt-2.5">
          <div className="mb-2.5">
            <button className="w-4/5 py-1.5 px-3.5 border-none text-white text-xs rounded-[38px] bg-[#4A90E2]">
              Pass
            </button>
          </div>
          <div className="bg-black/5 border border-solid border-[#62626226] rounded-[50px] grid grid-cols-7 justify-items-center p-0 px-5 w-full overflow-hidden justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((level) => (
              <button
                key={level}
                className={`bg-transparent w-[34px] h-[34px] rounded-[34px] text-base overflow-hidden border-none ${
                  highestBid?.level === level ? "text-white bg-[#4A90E2]" : ""
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
        <div className="flex justify-center -space-x-2">
          {restrictedPlayer.cards.map((card, index) => (
            <div key={index} className="w-[50px] h-[80px] bg-[rgba(0,0,0,0.18)] rounded-2xl">
              {card.suit} {card.rank}
            </div>
          ))}
        </div>
      </div>

      {/* West Player */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <div className="flex flex-col -space-y-2">
          {Array.from({
            length: biddingPhase.players.find((player) => player.position === westPlayerPosition)?.numCardsOnHand || 0,
          }).map((_, index) => (
            <div key={index} className="w-[50px] h-[80px] bg-[rgba(0,0,0,0.18)] rounded-2xl">
              Hi
            </div>
          ))}
        </div>
      </div>

      {/* North Player */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="flex justify-center space-x-2">
          {Array.from({
            length: biddingPhase.players.find((player) => player.position === northPlayerPosition)?.numCardsOnHand || 0,
          }).map((_, index) => (
            <div key={index} className="w-[100px] h-[123px] bg-[rgba(0,0,0,0.18)] rounded-2xl"></div>
          ))}
        </div>
      </div>

      {/* East Player */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="flex flex-col space-y-2">
          {Array.from({
            length: biddingPhase.players.find((player) => player.position === eastPlayerPosition)?.numCardsOnHand || 0,
          }).map((_, index) => (
            <div key={index} className="w-[100px] h-[123px] bg-[rgba(0,0,0,0.18)] rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Auction, Hands };
