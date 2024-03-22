import React from "react";
import { Card } from "types/Card";

interface PlayingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card?: Card;
  isFlipDown?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ card, isFlipDown = false, className = "", style, ...rest }) => {
  const isRedSuit = card?.suit === "♥" || card?.suit === "♦";

  // Dynamically setting the background color and border color based on isFlipDown
  const dynamicClass = isFlipDown ? "bg-sky-300 border-stone-600" : "bg-white border-black/5 text-black";

  // Determine the card's color based on its suit
  const cardColor = isRedSuit ? "#FF525D" : "#222222";

  return (
    <div
      className={`w-[100px] h-[123px] rounded-2xl border-4 p-3 select-none ${dynamicClass} ${className} mobile-portrait:w-[20px] mobile-portrait:h-[25px] mobile-portrait:p-1 mobile-landscape:w-[30px] mobile-landscape:h-[40px] mobile-landscape:p-2`}
      style={style}
      {...rest}
    >
      {!isFlipDown && (
        <div className="flex flex-col h-full">
          <div className="flex flex-col">
            <div className="text-xl font-bold select-none" style={{ color: cardColor }}>
              {card?.rank}
            </div>
            <div className="relative bottom-2 text-xl mb-2 select-none" style={{ color: cardColor }}>
              {card?.suit}
            </div>
          </div>
          <div className="flex-grow flex items-center justify-center relative bottom-6">
            <div className="text-6xl select-none" style={{ color: cardColor }}>
              {card?.suit}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayingCard;
