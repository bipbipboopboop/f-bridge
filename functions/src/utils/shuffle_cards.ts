import { Card, Suit, Rank, RankValue } from "types/Card";

/**
 * Utils for shuffling a deck of cards.
 */
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

export const shuffleCards = () => {
  // Create a deck of cards
  const deck: Card[] = [];
  for (let suit = 0; suit < 4; suit++) {
    for (let rank = 2; rank < 15; rank++) {
      const suitString = suitLookup[suit];
      const rankValue = rankValueLookup[rank];

      deck.push({
        suit: suitString,
        value: rank as RankValue,
        rank: rankValue,
      });
    }
  }

  // Shuffle the deck
  for (let i = 0; i < deck.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck;
};
