import {BiddingPhase} from "types/GameState";
import GreenButton from "../../buttons/button-green";
import {Bid, BidNumber, BidSuit} from "types/Bid";
import {useState} from "react";

const BiddingOptionsPanel = (props: {biddingPhase: BiddingPhase}) => {
  const {biddingPhase} = props;
  const {highestBid} = biddingPhase;

  const [selectedBidValue, setSelectedBidValue] = useState<BidNumber | null>(null);
  const possibleBids = getPossibleBids(highestBid);

  return (
    <div>
      <GreenButton>Pass</GreenButton>
      <GreenButton>Bid</GreenButton>
      <GreenButton>Clear</GreenButton>
      <div className="d-flex">
        {[1, 2, 3, 4, 5, 6].map((bidNumber) => (
          <button
            key={bidNumber}
            disabled={possibleBids[bidNumber as 1].length === 0}
            onClick={() => {
              setSelectedBidValue(bidNumber as 1);
            }}
          >
            {bidNumber}
          </button>
        ))}
      </div>
      <div className="d-flex">
        {selectedBidValue &&
          (["♣", "♦", "♥", "♠", "NT"] as BidSuit[]).map((suit) => (
            <button key={suit} disabled={!possibleBids[selectedBidValue].includes(suit)}>
              {suit}
            </button>
          ))}
      </div>
    </div>
  );
};

export default BiddingOptionsPanel;

const bidSuitList: BidSuit[] = ["♣", "♦", "♥", "♠", "NT"];

const allPossibleBids: string[] = [
  "1♣",
  "1♦",
  "1♥",
  "1♠",
  "1NT",
  "2♣",
  "2♦",
  "2♥",
  "2♠",
  "2NT",
  "3♣",
  "3♦",
  "3♥",
  "3♠",
  "3NT",
  "4♣",
  "4♦",
  "4♥",
  "4♠",
  "4NT",
  "5♣",
  "5♦",
  "5♥",
  "5♠",
  "5NT",
  "6♣",
  "6♦",
  "6♥",
  "6♠",
  "6NT",
];
const getPossibleBids = (highestBid: Bid | null) => {
  const possibleBids: Record<BidNumber, BidSuit[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  if (!highestBid) {
    // If there is no highest bid, all bids from 1 to 7 in each suit are possible
    for (let number = 1 as BidNumber; number <= 6; number++) {
      bidSuitList.forEach((suit) => {
        possibleBids[number].push(suit);
      });
    }
    return possibleBids;
  }

  const {suit, number} = highestBid;
  const bidString = `${number}${suit}`;
  const bidIndex = allPossibleBids.indexOf(bidString);

  const possibleBidsStrings = allPossibleBids.slice(bidIndex + 1);
  possibleBidsStrings.forEach((bidString) => {
    const bidNum = parseInt(bidString[0]) as BidNumber;
    const suit = bidString.slice(1) as BidSuit;
    possibleBids[bidNum].push(suit);
  });

  return possibleBids;
};
