import * as functions from "firebase-functions";

import { DocumentReference } from "firebase-admin/firestore";
import { HttpsError } from "firebase-functions/v1/https";
import { GAME_ROOMS_COLLECTION, gameRoomPlayersCollection } from "./colllections";
import { BID_SUITS, NUMBER_OF_PLAYERS } from "./constants";
import { getUidOrThrow, getGameRoomOrThrow, getPlayerInRoomOrThrow, updateDatabase } from "./common";

import type { Bid, BidRequest, BiddingPhase, GameRoom, GameState, PlayerPosition, GameRoomPlayer } from "./GameType";

export type BidResultStatus = "continue" | "finish" | "restart";

export type BidResult = {
  status: BidResultStatus;
  next: BiddingPhase;
};

function getBiddingPhaseOrThrow(gameState: GameState): BiddingPhase {
  const { status, biddingPhase } = gameState;
  if (status !== "bidding") {
    throw new HttpsError("failed-precondition", "The game must be in bidding phase");
  }
  return biddingPhase!;
}

function requirePlayerTurn(biddingPhase: BiddingPhase, gameRoomPlayer: GameRoomPlayer) {
  const { position } = gameRoomPlayer;
  const { currentPlayerIndex } = biddingPhase;
  if (position !== currentPlayerIndex) {
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

function requirePassOrHigherBid(biddingPhase: BiddingPhase, bidRequest: BidRequest) {
  const { highestBid } = biddingPhase;
  const { bid } = bidRequest;
  if (highestBid && bid && compareBid(highestBid.bid, bid) <= 0) {
    throw new HttpsError("failed-precondition", "New bid should be greater than the highest bid");
  }
}

function handleLogic(biddingPhase: BiddingPhase, playerID: string, { bid }: BidRequest): BidResult {
  let { currentPlayerIndex, numberOfPasses, highestBid } = biddingPhase;
  if (!bid) {
    numberOfPasses++;
  } else {
    highestBid = { bid, playerID };
  }

  let status: BidResultStatus;
  if (numberOfPasses === 4) {
    status = "restart";
    currentPlayerIndex = 0;
    highestBid = null;
    numberOfPasses = 0;
  } else if (numberOfPasses === 3 && highestBid) {
    status = "finish";
  } else {
    status = "continue";
    currentPlayerIndex = ((currentPlayerIndex + 1) % NUMBER_OF_PLAYERS) as PlayerPosition;
  }
  return { status, next: { currentPlayerIndex, highestBid, numberOfPasses } };
}

function updateGameState(gameState: GameState, bidResult: BidResult): GameState {
  const { status, next } = bidResult;
  const newGameState = { ...gameState };
  if (status === "finish") {
    newGameState.status = "picking teammate";
    // transition to trick traking phase
    newGameState.pickingTeammatePhase = {
      playerID: next.highestBid!.playerID,
    };
  } else {
    newGameState.biddingPhase = next;
  }
  return newGameState;
}

export const placeBid = functions.https.onCall(
  async ({ bidRequest, roomID }: { bidRequest: BidRequest; roomID: string }, context) => {
    const uid = getUidOrThrow(context);

    const gameRoomRef = GAME_ROOMS_COLLECTION.doc(roomID);
    const gameRoom = await getGameRoomOrThrow(gameRoomRef);
    const gameState = gameRoom.state;
    const biddingPhase = getBiddingPhaseOrThrow(gameState);

    const gameRoomPlayerRef = gameRoomPlayersCollection(gameRoomRef).doc(uid);
    const gameRoomPlayer = await getPlayerInRoomOrThrow(gameRoomPlayerRef);

    requirePlayerTurn(biddingPhase, gameRoomPlayer);
    requirePassOrHigherBid(biddingPhase, bidRequest);

    const bidResult = handleLogic(biddingPhase, uid, bidRequest);
    const newGameState = updateGameState(gameState, bidResult);
    await updateDatabase(gameRoomRef, newGameState);

    return bidResult;
  }
);
