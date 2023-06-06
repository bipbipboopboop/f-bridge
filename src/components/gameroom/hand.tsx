import PlayingCard from "../../assets/playing_card";
import "./hand.css";
const Hand = () => {
  return (
    <div className="hand">
      {/* <PlayingCard card={{suit: "♠", value: 10, stringValue: "10"}} /> */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(() => (
        <PlayingCard
          card={{suit: "♠", value: 10, stringValue: "10"}}
          style={{marginLeft: "-2.2rem"}}
        />
      ))}
    </div>
  );
};

export default Hand;
