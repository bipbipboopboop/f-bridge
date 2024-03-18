export type BidLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type BidSuit = "Pass" | "♠" | "♣" | "♥" | "♦" | "NT";
export interface Bid {
  level: BidLevel;
  suit: BidSuit;
}
