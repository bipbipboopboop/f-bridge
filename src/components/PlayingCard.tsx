import React from "react";
import { Card } from "types/Card";

interface PlayingCardProps {
  card?: Card;
  isFlipDown?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ card, isFlipDown = false, className, style }) => {
  const isRedSuit = card?.suit === "♥" || card?.suit === "♦";

  if (isFlipDown) {
    return (
      <div
        className={`w-[100px] h-[123px] bg-sky-300 rounded-2xl border-4 border-stone-600 p-3 ${className}`}
        style={style}
      ></div>
    );
  }

  return (
    <div
      className={`w-[100px] h-[123px] bg-white rounded-2xl text-black border-4 border-black/5 p-3 ${className}`}
      style={style}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col">
          <div className="text-xl font-bold" style={{ color: isRedSuit ? "#FF525D" : "#222222" }}>
            {card?.rank}
          </div>
          <div className="text-xl" style={{ color: isRedSuit ? "#FF525D" : "#222222" }}>
            {card?.suit}
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center relative bottom-6">
          <div className="text-6xl" style={{ color: isRedSuit ? "#FF525D" : "#222222" }}>
            {card?.suit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayingCard;
