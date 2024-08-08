import React from "react";
import { Suit, Rank } from "types/Card";

interface TeammateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  suit?: Suit | null;
  rank?: Rank | null;
}

// Helper functions
const isRedSuit = (suit?: Suit | null): boolean => suit === "♥" || suit === "♦";
const getCardColor = (suit?: Suit | null): string => (isRedSuit(suit) ? "#FF525D" : "#222222");

// Styles
const baseCardStyle = "border-2 rounded-md select-none md:border-4 md:rounded-2xl";
const cardSizeStyle = "w-[55px] h-[68px] p-2 md:w-[100px] md:h-[123px] md:p-3";
const cardStyle = "bg-white border-black/5 text-black";

const TeammateCard: React.FC<TeammateCardProps> = ({ suit, rank, className = "", style, ...rest }) => {
  const cardColor = getCardColor(suit);

  return (
    <div className={`${baseCardStyle} ${cardSizeStyle} ${cardStyle} ${className}`} style={style} {...rest}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col">
          <div className="text-xs md:text-xl font-bold select-none " style={{ color: cardColor }}>
            {rank || " "}
          </div>
          <div className="relative bottom-2 text-xl mb-2 select-none" style={{ color: cardColor }}>
            {suit || " "}
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center relative bottom-6">
          <div className="text-xl md:text-6xl select-none" style={{ color: cardColor }}>
            {suit || " "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeammateCard;
