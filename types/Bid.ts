export type Bid = {
  suit: BidSuit;
  number: number;
  isPass: boolean;
};

export type BidNumber = 1 | 2 | 3 | 4 | 5 | 6;
export type BidSuit = "♣" | "♦" | "♥" | "♠" | "NT";

// export class Bid {
//   suit: Suit;
//   number: number;

//   constructor(suit: Suit, number: number) {
//     this.suit = suit;
//     this.number = number;
//   }

//   compareTo(otherBid: Bid | null): number {
//     if (!otherBid) {
//       return 1;
//     }
//     if (this.number > otherBid.number) {
//       return 1;
//     } else if (this.number < otherBid.number) {
//       return -1;
//     } else {
//       // If the numbers are equal, compare the suits
//       const suitsOrder: BidSuit[] = ["♣", "♦", "♥", "♠", "NT"];
//       const thisSuitIndex = suitsOrder.indexOf(this.suit);
//       const otherSuitIndex = suitsOrder.indexOf(otherBid.suit);

//       if (thisSuitIndex > otherSuitIndex) {
//         return 1;
//       } else if (thisSuitIndex < otherSuitIndex) {
//         return -1;
//       } else {
//         return 0; // Bids are equal
//       }
//     }
//   }

//   largerThan(otherBid: Bid): boolean {
//     return this.compareTo(otherBid) === 1;
//   }
// }
