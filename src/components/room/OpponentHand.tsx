// OpponentHand.tsx
import { useMediaQuery } from "react-responsive";
import { useRoom } from "../../context/RoomContext";
import { useAuth } from "../../hooks/useAuth";
import PlayingCard from "../PlayingCard";

interface OpponentHandProps {
  direction: "west" | "north" | "east";
  className?: string;
}

const OpponentHand: React.FC<OpponentHandProps> = ({ direction, className }) => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();
  const isDesktop = useMediaQuery({ minWidth: 930, orientation: "landscape" });
  const isLandscape = useMediaQuery({ orientation: "landscape" }) && !isDesktop;

  if (!playerAccount || !room) {
    return null;
  }

  const currentPlayerPosition = room.players.find((player) => player.id === playerAccount.id)!.position as number;

  const positionMap: Record<string, number> = {
    west: (currentPlayerPosition + 3) % 4,
    north: (currentPlayerPosition + 2) % 4,
    east: (currentPlayerPosition + 1) % 4,
  };

  const position = positionMap[direction];
  const numCards = room.players.find((player) => player.position === position)?.numCardsOnHand || 0;

  const desktopCardHorizontalGap = 40;
  const landscapeCardHorizontalGap = 20;
  const cardHorizontalGap = isDesktop ? desktopCardHorizontalGap : landscapeCardHorizontalGap;

  const desktopCardVerticalGap = 68;
  const landscapeCardVerticalGap = 20;
  const cardVerticalGap = isDesktop ? desktopCardVerticalGap : landscapeCardVerticalGap;

  return (
    <div className={className}>
      <div className={`flex ${direction === "north" ? "justify-center -space-x-[5%]" : "relative"}`}>
        {Array.from({ length: numCards }).map((_, index) => (
          <PlayingCard
            key={index}
            isFlipDown
            style={{
              position: direction !== "north" ? "absolute" : "static",
              top: direction !== "north" ? `${Math.floor(index / 4) * cardVerticalGap}px` : "auto",
              right: direction === "west" ? `${(index % 4) * cardHorizontalGap}px ` : "auto",
              left: direction === "east" ? `${(index % 4) * cardHorizontalGap}px` : "auto",
              zIndex: direction !== "north" ? 40 - index * 2 : "auto",
            }}
          />
        ))}
      </div>
    </div>
  );
};
// text-2xs mobile-landscape:h-[18px] mobile-landscape:w-[18px]
export default OpponentHand;
