import { Suit, Rank, RankValue, Card } from "types/Card";
import { RestrictedPlayerData } from "types/GameState";

export const getRankValue = (rank: Rank): RankValue => {
  const rankValues: { [key: string]: RankValue } = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  };
  return rankValues[rank];
};

export const getAvailableRanks = (restrictedPlayer: RestrictedPlayerData, suit: Suit): Rank[] => {
  const bidWinnerCards = restrictedPlayer?.cards || [];
  const availableRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"].filter((rank) => {
    return !bidWinnerCards.some((card) => card.suit === suit && card.rank === rank);
  });
  return availableRanks as Rank[];
};

export const getHighestRank = (restrictedPlayer: RestrictedPlayerData, suit: Suit): Rank | null => {
  const availableRanks = getAvailableRanks(restrictedPlayer, suit);
  return availableRanks.length > 0 ? availableRanks[availableRanks.length - 1] : null;
};

export const isOnlyOneRankAvailable = (restrictedPlayer: RestrictedPlayerData, suit: Suit): boolean => {
  const availableRanks = getAvailableRanks(restrictedPlayer, suit);
  return availableRanks.length === 1;
};

export const getFirstAvailableSuit = (restrictedPlayer: RestrictedPlayerData): Suit | null => {
  const suits = ["♣", "♦", "♥", "♠"];
  for (const suit of suits) {
    const availableRanks = getAvailableRanks(restrictedPlayer, suit as Suit);
    if (availableRanks.length > 0) {
      return suit as Suit;
    }
  }
  return null;
};
