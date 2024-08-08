import React from "react";
import { Card, Suit } from "types/Card";

interface PlayingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card?: Card;
  isFlipDown?: boolean;
}

// Helper functions
const isRedSuit = (suit?: Suit): boolean => suit === "♥" || suit === "♦";
const getCardColor = (suit?: Suit): string => (isRedSuit(suit) ? "#FF525D" : "#222222");

// Styles
const baseCardStyle = "border-2 rounded-md select-none md:border-4 md:rounded-2xl";
const cardSizeStyle = "w-[55px] h-[68px] p-2 md:w-[100px] md:h-[123px] md:p-3";
const flipDownStyle = "bg-sky-300 border-stone-600";
const flipUpStyle = "bg-white border-black/5 text-black";

const PlayingCard: React.FC<PlayingCardProps> = ({ card, isFlipDown = false, className = "", style, ...rest }) => {
  const cardStyle = isFlipDown ? flipDownStyle : flipUpStyle;
  const cardColor = getCardColor(card?.suit);

  if (isFlipDown) {
    return <div className={`${baseCardStyle} ${cardSizeStyle} ${cardStyle} ${className}`} style={style} {...rest} />;
  }

  return (
    <div className={`${baseCardStyle} ${cardSizeStyle} ${cardStyle} ${className}`} style={style} {...rest}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col">
          <div className="text-xs md:text-xl font-bold select-none" style={{ color: cardColor }}>
            {card?.rank}
          </div>
          <div className="relative bottom-2 text-xl mb-2 select-none" style={{ color: cardColor }}>
            {card?.suit}
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center relative bottom-6">
          <div className="text-xl md:text-6xl select-none" style={{ color: cardColor }}>
            {card?.suit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayingCard;
