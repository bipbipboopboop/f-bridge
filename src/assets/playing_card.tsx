import {Card} from "types/Card";
import "./playing_card.css";

type PlayingCardProps = {
  card: Card;
};

const PlayingCard: React.FC<React.HTMLAttributes<HTMLDivElement> & PlayingCardProps> = ({...props}) => {
  const {card} = props;
  const cardColor = ["♥", "♦"].includes(card.suit) ? "red" : "black";

  return (
    <div className={`playing-card-${cardColor}`} {...props}>
      <div className="suit">{card.suit}</div>
      <div className="string-value">{card.stringValue}</div>
    </div>
  );
};

export default PlayingCard;
