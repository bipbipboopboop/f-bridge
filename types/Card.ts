export type Suit = "♣" | "♦" | "♥" | "♠";
export type BidSuit = Suit | "NT";

export type CardStringValue =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "10"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

export type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type Card = {
  suit: Suit;
  value: CardValue;
  stringValue: CardStringValue;
};
