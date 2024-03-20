import PlayingCard from "../PlayingCard";

interface OpponentHandProps {
  position: number;
  numCards: number;
  className?: string;
}

const OpponentHand: React.FC<OpponentHandProps> = ({ position, numCards, className }) => {
  return (
    <div className={`flex relative ${className}`}>
      {Array.from({ length: numCards }).map((_, index) => (
        <PlayingCard
          key={index}
          isFlipDown
          style={{
            position: "absolute",
            top: `${Math.floor(index / 4) * 68}px`,
            right: position === 1 ? `${(index % 4) * 40}px` : "",
            left: position === 3 ? `${(index % 4) * 40}px` : "",
            zIndex: 40 - index * 2,
          }}
        />
      ))}
    </div>
  );
};

export default OpponentHand;
