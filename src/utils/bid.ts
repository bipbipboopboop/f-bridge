import {Bid, BidNumber, BidSuit} from "types/Bid";

const BID_SUITS: BidSuit[] = ["♣", "♦", "♥", "♠", "NT"];

const ALL_BIDS: string[] = [
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
export const getPossibleBids = (highestBid: Bid | null) => {
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
      BID_SUITS.forEach((suit) => {
        possibleBids[number].push(suit);
      });
    }
    return possibleBids;
  }

  const {suit, number} = highestBid;
  const bidString = `${number}${suit}`;
  const bidIndex = ALL_BIDS.indexOf(bidString);

  const possibleBidsStrings = ALL_BIDS.slice(bidIndex + 1);
  possibleBidsStrings.forEach((bidString) => {
    const bidNum = parseInt(bidString[0]) as BidNumber;
    const suit = bidString.slice(1) as BidSuit;
    possibleBids[bidNum].push(suit);
  });

  return possibleBids;
};
