import { BidSuit, CardValue } from "./GameType";

/**
 * The number of players in a single game
 */
export const NUMBER_OF_PLAYERS = 4;

/**
 * The bid suits, sorted in ascending order
 */
export const BID_SUITS: BidSuit[] = ["♣", "♦", "♥", "♠", "NT"];

/**
 * The possible values of a card
 */
export const CARD_VALUES: CardValue[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
