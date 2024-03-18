import { Card, Rank, RankValue, Suit } from "types/Card";

type SuitLookup = {
  [key: number]: Suit;
};

const suitLookup: SuitLookup = {
  0: "♣",
  1: "♦",
  2: "♥",
  3: "♠",
};

type StringValueLookup = {
  [key: number]: Rank;
};

const rankValueLookup: StringValueLookup = {
  14: "A",
  13: "K",
  12: "Q",
  11: "J",
  10: "10",
  9: "9",
  8: "8",
  7: "7",
  6: "6",
  5: "5",
  4: "4",
  3: "3",
  2: "2",
};

export const deck: Card[] = [];
for (let suit = 0; suit < 4; suit++) {
  for (let value = 2; value < 15; value++) {
    let suitString: Suit;
    let rank: Rank;

    suitString = suitLookup[suit];
    rank = rankValueLookup[value];

    deck.push({
      suit: suitString,
      value: value as RankValue,
      rank: rank,
    });
  }
}
