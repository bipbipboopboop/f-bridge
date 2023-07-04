import * as functions from "firebase-functions";

import { HttpsError } from "firebase-functions/v1/https";
import { GAME_ROOMS_COLLECTION, gameRoomPlayersCollection } from "./colllections";
import { getGameRoomOrThrow, getPlayerInRoomOrThrow, getUidOrThrow, nextPlayerPosition } from "./common";
import { BID_SUITS } from "./constants";

import type { Bid, BiddingPhase, GameRoomPlayer, GameState } from "./GameType";

function getBiddingPhaseOrThrow(gameState: GameState): BiddingPhase {
  const { status, biddingPhase } = gameState;
  if (status !== "bidding") {
    throw new HttpsError("failed-precondition", "The game must be in bidding phase");
  }
  return biddingPhase!;
}

function requirePlayerTurn(biddingPhase: BiddingPhase, gameRoomPlayer: GameRoomPlayer) {
  const { position } = gameRoomPlayer;
  const { currentPlayerPosition } = biddingPhase;
  if (position !== currentPlayerPosition) {
    throw new HttpsError("failed-precondition", "It's not this player turn");
  }
}

function compareBid(first: Bid, second: Bid) {
  // compare bid number first, then compare the suit
  const diff = first.number - second.number;
  if (diff) {
    return diff;
  }
  return BID_SUITS.indexOf(first.suit) - BID_SUITS.indexOf(second.suit);
}

function requirePassOrHigherBid(biddingPhase: BiddingPhase, bid: Bid | null) {
  const { highestBid } = biddingPhase;
  if (highestBid && bid && compareBid(highestBid.bid, bid) >= 0) {
    throw new HttpsError("failed-precondition", "New bid should be greater than the highest bid");
  }
}

function updateGameState(gameState: GameState, player: GameRoomPlayer, bid: Bid | null): GameState {
  const nextGameState = { ...gameState };
  let { currentPlayerPosition, numberOfPasses, highestBid } = gameState.biddingPhase!;
  if (!bid) {
    numberOfPasses++;
  } else {
    highestBid = { bid, playerID: player.ID, position: player.position };
  }

  if (numberOfPasses === 4) {
    currentPlayerPosition = 0;
    highestBid = null;
    numberOfPasses = 0;
  } else if (numberOfPasses === 3 && highestBid) {
    const {
      bid: { number, suit },
      position,
    } = highestBid;
    nextGameState.status = "picking teammate";
    nextGameState.pickingTeammatePhase = {
      bidNumber: number,
      trumpSuit: suit,
      playerPosition: position,
    };
  } else {
    currentPlayerPosition = nextPlayerPosition(currentPlayerPosition);
  }
  nextGameState.biddingPhase = {
    currentPlayerPosition,
    highestBid,
    numberOfPasses,
  };
  return nextGameState;
}

export const placeBid = functions.https.onCall(async ({ bid, roomID }: { bid: Bid | null; roomID: string }, context) => {
  const uid = getUidOrThrow(context);

  const gameRoomRef = GAME_ROOMS_COLLECTION.doc(roomID);
  const gameRoom = await getGameRoomOrThrow(gameRoomRef);
  const gameState = gameRoom.state;
  const biddingPhase = getBiddingPhaseOrThrow(gameState);
  const gameRoomPlayerRef = gameRoomPlayersCollection(gameRoomRef).doc(uid);
  const gameRoomPlayer = await getPlayerInRoomOrThrow(gameRoomPlayerRef);

  requirePlayerTurn(biddingPhase, gameRoomPlayer);
  requirePassOrHigherBid(biddingPhase, bid);

  const newGameState = updateGameState(gameState, gameRoomPlayer, bid);
  await gameRoomRef.update({ state: newGameState });
});
