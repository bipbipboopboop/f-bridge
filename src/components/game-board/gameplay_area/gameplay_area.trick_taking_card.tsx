import {Card} from "types/Card";
import PlayingCard from "assets/playing_card";

const PlayingAreaCard = (props: {card: Card | null; location: "top" | "bottom" | "left" | "right"; zIndex: number}) => {
  const {card, location, zIndex} = props;

  const rotationLookup = {
    top: "0deg",
    bottom: "0deg",
    left: "90deg",
    right: "270deg",
  };

  const topOffset = {
    top: "3rem",
    bottom: "-3rem",
    left: "0rem",
    right: "0rem",
  };
  if (card)
    return (
      <PlayingCard
        card={card}
        style={{
          zIndex,
          rotate: rotationLookup[location],
          position: "relative",
          top: topOffset[location],
        }}
      />
    );
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "7rem",
        width: "5rem",
        rotate: rotationLookup[location],
        position: "relative",
        top: topOffset[location],
      }}
    ></div>
  );
};

export default PlayingAreaCard;
