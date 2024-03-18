export type BidLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type BidSuit = "♠" | "♣" | "♥" | "♦" | "NT";
export interface Bid {
  level: BidLevel;
  suit: BidSuit;
}
