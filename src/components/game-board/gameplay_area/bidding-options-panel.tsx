import {BiddingPhase} from "types/GameState";
import {Bid, BidNumber, BidSuit} from "types/Bid";
import {FC, HTMLAttributes, useState} from "react";
import {useAuth} from "../../../hooks/useAuth";
import BidButton from "../../buttons/button-bid";

type BiddingOptionsPanelProps = {
  biddingPhase: BiddingPhase;
};

const BiddingOptionsPanel: FC<HTMLAttributes<HTMLDivElement> & BiddingOptionsPanelProps> = ({...props}) => {
  const [selectedBidValue, setSelectedBidValue] = useState<BidNumber | null>(null);
  const [selectedBidSuit, setSelectedBidSuit] = useState<BidSuit | null>(null);
  const {playerProfile} = useAuth();

  const {
    biddingPhase: {currentPlayerIndex, highestBid, gameroomPlayersList},
    ...divProps
  } = props;

  const possibleBids = getPossibleBids(highestBid);
  const currentBidder = gameroomPlayersList.filter((plyr) => plyr.position === currentPlayerIndex)[0];
  const isMyTurnToBid = currentBidder.id === playerProfile?.id;

  if (!isMyTurnToBid) return <></>;

  return (
    <div {...divProps}>
      <div className="w-100">
        <div className="d-flex">
          {[1, 2, 3, 4, 5, 6].map((bidValue) => (
            <BidButton
              style={{marginRight: "0.5rem", border: `${bidValue === selectedBidValue ? "5px solid #BD8E63" : ""}`}}
              key={bidValue}
              disabled={possibleBids[bidValue as 1].length === 0}
              onClick={() => {
                setSelectedBidValue(bidValue as 1);
              }}
            >
              {bidValue}
            </BidButton>
          ))}
          <BidButton style={{width: "6rem"}}>Pass</BidButton>
        </div>
        <div className="d-flex">
          {selectedBidValue && (
            <>
              {(["♣", "♦", "♥", "♠", "NT"] as BidSuit[]).map((suit) => (
                <BidButton
                  style={{
                    marginTop: "0.5rem",
                    marginRight: "0.5rem",
                    color: `${suit === "♦" || suit === "♥" ? "#ff525d" : "black"}`,
                    fontSize: `${suit === "NT" ? "1rem" : "2rem"}`,
                    border: `${suit === selectedBidSuit ? "5px solid #BD8E63" : ""}`,
                  }}
                  key={suit}
                  disabled={!possibleBids[selectedBidValue].includes(suit)}
                  onClick={() => {
                    setSelectedBidSuit(suit);
                  }}
                >
                  {suit}
                </BidButton>
              ))}
              <BidButton style={{marginTop: "0.5rem", marginRight: "0.5rem"}} onClick={() => setSelectedBidValue(null)}>
                ↩︎︎
              </BidButton>
              <BidButton
                style={{width: "6rem", marginTop: "0.5rem"}}
                onClick={() => {
                  alert(JSON.stringify({selectedBidSuit, selectedBidValue}));
                }}
              >
                Bid
              </BidButton>
            </>
          )}
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
