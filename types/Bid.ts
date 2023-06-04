import {Suit} from "./Card";

export class Bid {
  suit: Suit;
  number: number;

  constructor(suit: Suit, number: number) {
    this.suit = suit;
    this.number = number;
  }

  compareTo(otherBid: Bid): number {
    if (this.number > otherBid.number) {
      return 1;
    } else if (this.number < otherBid.number) {
      return -1;
    } else {
      // If the numbers are equal, compare the suits
      const suitsOrder: Suit[] = ["♣", "♦", "♥", "♠", "NT"];
      const thisSuitIndex = suitsOrder.indexOf(this.suit);
      const otherSuitIndex = suitsOrder.indexOf(otherBid.suit);

      if (thisSuitIndex > otherSuitIndex) {
        return 1;
      } else if (thisSuitIndex < otherSuitIndex) {
        return -1;
      } else {
        return 0; // Bids are equal
      }
    }
  }

  largerThan(otherBid: Bid): boolean {
    return this.compareTo(otherBid) === 1;
  }
}
