export type Suit = "♣" | "♦" | "♥" | "♠";
export type BidSuit = Suit | "NT";

export type Card = {
  suit: Suit;
  value: number;
};
