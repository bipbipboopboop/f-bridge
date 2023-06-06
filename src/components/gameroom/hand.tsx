import PlayingCard from "../../assets/playing_card";
import "./hand.css";
const Hand = () => {
  return (
    <div className="hand">
      <PlayingCard card={{suit: "♠", value: 10, stringValue: "10"}} />
      <PlayingCard
        card={{suit: "♠", value: 10, stringValue: "10"}}
        style={{marginLeft: "-2.2rem"}}
      />
      <PlayingCard
        card={{suit: "♠", value: 10, stringValue: "10"}}
        style={{marginLeft: "-2.2rem"}}
      />
      <PlayingCard
        card={{suit: "♠", value: 10, stringValue: "10"}}
        style={{marginLeft: "-2.2rem"}}
      />
    </div>
  );
};

export default Hand;
