import {Card, Suit} from "types/Card";

/**
 * Shuffles a deck of cards.
 * @returns A shuffled deck of cards
 */
export const shuffleCards = () => {
  // Create a deck of cards
  const deck: Card[] = [];
  for (let suit = 0; suit < 4; suit++) {
    for (let rank = 0; rank < 13; rank++) {
      let suitString: Suit;

      switch (suit) {
        case 0:
          suitString = "♣";
          break;
        case 1:
          suitString = "♦";
          break;
        case 2:
          suitString = "♥";
          break;
        default:
          suitString = "♠";
          break;
      }

      deck.push({
        suit: suitString,
        value: rank,
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
