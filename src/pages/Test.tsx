import {memo, useState} from "react";
import BiddingTable from "../components/tables/bidding.table";
import GreenButton from "../components/buttons/button.green";

import {BidNumber, Bid} from "types/Bid";
import {BidSuit} from "types/Card";

import {BiddingPhase} from "types/GameState";
import {GameRoomPlayer} from "types/PlayerProfile";

// import {getPossibleBids} from "utils/bids-utils";

// Testing for BidOptions
const biddingPhase: BiddingPhase = {
  gameroomPlayersList: [
    {
      avatarID: "1",
      displayName: "Player 1",
      id: "0",
      numCardsOnHand: 13,
      position: 0,
      currentCardOnTable: null,
      numTricksWon: 0,
    },
    {
      avatarID: "2",
      displayName: "Player 2",
      id: "1",
      numCardsOnHand: 13,
      position: 1,
      currentCardOnTable: null,
      numTricksWon: 0,
    },
    {
      avatarID: "3",
      displayName: "Player 3",
      id: "2",
      numCardsOnHand: 13,
      position: 2,
      currentCardOnTable: null,
      numTricksWon: 0,
    },
    {
      avatarID: "4",
      displayName: "Player 4",
      id: "3",
      numCardsOnHand: 13,
      position: 3,
      currentCardOnTable: null,
      numTricksWon: 0,
    },
  ],

  currentBidderIndex: 0,
  highestBid: {number: 2, suit: "♣"},
  bidHistory: [
    {
      p0: {bid: null, info: {displayName: "Player 1", id: "0"}},
      p1: {
        bid: {number: 1, suit: "♣"},
        info: {displayName: "Player 2", id: "1"},
      },
      p2: {bid: null, info: {displayName: "Player 3", id: "2"}},
      p3: {bid: null, info: {displayName: "Player 4", id: "3"}},
    },
    {
      p0: {bid: null, info: {displayName: "Player 1", id: "0"}},
      p1: {bid: null, info: {displayName: "Player 2", id: "1"}},
      p2: {bid: null, info: {displayName: "Player 3", id: "2"}},
      p3: {bid: null, info: {displayName: "Player 4", id: "3"}},
    },
    {
      p0: {bid: null, info: {displayName: "Player 1", id: "0"}},
      p1: {bid: null, info: {displayName: "Player 2", id: "1"}},
      p2: {bid: null, info: {displayName: "Player 3", id: "2"}},
      p3: {bid: null, info: {displayName: "Player 4", id: "3"}},
    },
    {
      p0: {bid: null, info: {displayName: "Player 1", id: "0"}},
      p1: {bid: null, info: {displayName: "Player 2", id: "1"}},
      p2: {bid: null, info: {displayName: "Player 3", id: "2"}},
      p3: {bid: null, info: {displayName: "Player 4", id: "3"}},
    },
    {
      p0: {bid: null, info: {displayName: "Player 1", id: "0"}},
      p1: {bid: null, info: {displayName: "Player 2", id: "1"}},
      p2: {bid: null, info: {displayName: "Player 3", id: "2"}},
      p3: {bid: null, info: {displayName: "Player 4", id: "3"}},
    },
  ],
};
const Test = () => {
  const {currentBidderIndex, gameroomPlayersList, highestBid} = biddingPhase;

  const currentBidder = gameroomPlayersList.find(
    (plyr) => plyr.position === currentBidderIndex
  ) as GameRoomPlayer;

  // TODO: Get from AuthContext
  const myID = "0";

  const isMyTurnToBid = currentBidder.id === myID;
  const [selectedBidValue, setSelectedBidValue] = useState<BidNumber | null>(
    null
  );

  const possibleBids = getPossibleBids(highestBid);

  return (
    <div className="w-75 h-75 d-flex flex-column justify-content-center align-items-center">
      <BiddingMessage
        currentBidder={currentBidder}
        isMyTurnToBid={isMyTurnToBid}
      />

      <BiddingTable biddingPhase={biddingPhase} />
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
              <button
                key={suit}
                disabled={!possibleBids[selectedBidValue].includes(suit)}
              >
                {suit}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Test);

const BiddingMessage = (props: {
  isMyTurnToBid: boolean;
  currentBidder: GameRoomPlayer;
}) => {
  const {currentBidder, isMyTurnToBid} = props;
  return (
    <div>
      {!isMyTurnToBid && <p>{`${currentBidder.displayName} is bidding ...`}</p>}
      {isMyTurnToBid && <p>Your turn to bid</p>}
    </div>
  );
};

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
