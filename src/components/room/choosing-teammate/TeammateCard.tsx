import React from "react";
import { Suit, Rank } from "types/Card";

interface TeammateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  suit?: Suit | null;
  rank?: Rank | null;
  className?: string;
  style?: React.CSSProperties;
}

const TeammateCard: React.FC<TeammateCardProps> = ({ suit, rank, className, style, ...rest }) => {
  const isRedSuit = suit === "♥" || suit === "♦";

  return (
    <div
      className={`w-[100px] h-[123px] bg-white rounded-2xl text-black border-4 border-black/5 p-3 ${className}`}
      style={style}
      {...rest}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col">
          <div className="text-xl font-bold" style={{ color: isRedSuit ? "#FF525D" : "#222222" }}>
            {rank || " "}
          </div>
          <div className="relative bottom-2 text-xl mb-2" style={{ color: isRedSuit ? "#FF525D" : "#222222" }}>
            {suit || " "}
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center relative bottom-6">
          <div className="text-6xl" style={{ color: isRedSuit ? "#FF525D" : "#222222" }}>
            {suit || " "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeammateCard;
