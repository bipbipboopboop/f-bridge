import {BiddingPhase} from "types/GameState";
import GreenButton from "../../buttons/button-green";
import {Bid, BidNumber, BidSuit} from "types/Bid";
import {FC, HTMLAttributes, useState} from "react";
import {useAuth} from "../../../hooks/useAuth";
import Button from "../../buttons/button";

type BiddingOptionsPanelProps = {
  biddingPhase: BiddingPhase;
};

const BiddingOptionsPanel: FC<HTMLAttributes<HTMLDivElement> & BiddingOptionsPanelProps> = ({...props}) => {
  const {biddingPhase, ...divProps} = props;
  const {highestBid} = biddingPhase;
  const {currentBidderIndex, gameroomPlayersList} = biddingPhase;

  const [selectedBidValue, setSelectedBidValue] = useState<BidNumber | null>(null);
  const possibleBids = getPossibleBids(highestBid);

  const {playerProfile} = useAuth();

  const currentBidder = gameroomPlayersList.filter((plyr) => plyr.position === currentBidderIndex)[0];

  const isMyTurnToBid = currentBidder.id === playerProfile?.id;

  if (!isMyTurnToBid) return <></>;

  return (
    <div {...divProps}>
      <div className="d-flex w-100">
        <div>
          <div className="d-flex">
            {[1, 2, 3, 4, 5, 6].map((bidNumber) => (
              <Button
                theme={"yellow"}
                key={bidNumber}
                disabled={possibleBids[bidNumber as 1].length === 0}
                onClick={() => {
                  setSelectedBidValue(bidNumber as 1);
                }}
              >
                {bidNumber}
              </Button>
            ))}
          </div>
          <div className="d-flex">
            {selectedBidValue &&
              (["♣", "♦", "♥", "♠", "NT"] as BidSuit[]).map((suit) => (
                <Button theme={"yellow"} key={suit} disabled={!possibleBids[selectedBidValue].includes(suit)}>
                  {suit}
                </Button>
              ))}
          </div>
        </div>
        <div>
          <div>
            <Button theme={"yellow"}>Pass</Button>
            <Button theme={"yellow"}>Bid</Button>
          </div>
          <Button theme={"yellow"}>Clear</Button>
        </div>
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
