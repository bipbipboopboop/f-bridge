import * as functions from "firebase-functions";

import { DocumentReference } from "firebase-admin/firestore";
import { CallableContext, HttpsError } from "firebase-functions/v1/https";
import { GameRoomPlayer } from "types/PlayerProfile";
import { GAME_ROOMS_COLLECTION } from "./colllections";
import { BID_SUITS, NUMBER_OF_PLAYERS } from "./constants";

import type {
  Bid,
  BidRequest,
  BiddingPhase,
  GameRoom,
  GameState,
  PlayerPosition,
} from "./GameType";

export type BidResultStatus = "continue" | "finish" | "restart";

export type BidResult = {
  status: BidResultStatus;
  next: BiddingPhase;
};

// TODO: write wrapper for the DB

function getUidOrThrow(context: CallableContext): string {
  const { auth } = context;
  if (!auth) {
    throw new HttpsError("unauthenticated", "The user is not authenticated");
  }
  return auth.uid;
}

async function getGameRoomOrThrow(
  gameRoomRef: DocumentReference<GameRoom>
): Promise<GameRoom> {
  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoom = gameRoomSnapshot.data();
  if (!gameRoom) {
    throw new HttpsError("not-found", "The game does not exist");
  }
  return gameRoom;
}

async function getPlayerInRoomOrThrow(
  gameRoomPlayerRef: DocumentReference<GameRoomPlayer>
): Promise<GameRoomPlayer> {
  const gameRoomPlayerSnapshot = await gameRoomPlayerRef.get();
  const gameRoomPlayer = gameRoomPlayerSnapshot.data();
  if (!gameRoomPlayer) {
    throw new HttpsError("failed-precondition", "No such player in the room");
  }
  return gameRoomPlayer;
}

function getBiddingPhaseOrThrow(gameState: GameState): BiddingPhase {
  const { biddingPhase } = gameState;
  if (!biddingPhase) {
    throw new HttpsError(
      "failed-precondition",
      "The game must be in bidding phase"
    );
  }
  return biddingPhase;
}

function requirePlayerTurn(
  biddingPhase: BiddingPhase,
  gameRoomPlayer: GameRoomPlayer
) {
  const { position } = gameRoomPlayer;
  const { currentPlayerIndex } = biddingPhase;
  if (position !== currentPlayerIndex) {
    throw new HttpsError("failed-precondition", "It's not this player turn");
  }
}

function compareBid(first: Bid, second: Bid) {
  // compare bid number first, then compare the suit
  const numberDiff = first.number - second.number;
  if (numberDiff) {
    return numberDiff;
  }
  return BID_SUITS.indexOf(first.suit) - BID_SUITS.indexOf(second.suit);
}

function requirePassOrHigherBid(
  biddingPhase: BiddingPhase,
  bidRequest: BidRequest
) {
  const { highestBid } = biddingPhase;
  const { bid } = bidRequest;
  if (highestBid && bid && compareBid(highestBid.bid, bid) <= 0) {
    throw new HttpsError(
      "failed-precondition",
      "New bid should be greater than the highest bid"
    );
  }
}

function handleLogic(
  biddingPhase: BiddingPhase,
  playerID: string,
  { bid }: BidRequest
): BidResult {
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
    currentPlayerIndex = ((currentPlayerIndex + 1) %
      NUMBER_OF_PLAYERS) as PlayerPosition;
  }

  return { status, next: { currentPlayerIndex, highestBid, numberOfPasses } };
}

function updateGameState(
  gameState: GameState,
  bidResult: BidResult
): GameState {
  const { status, next } = bidResult;
  const newGameState = { ...gameState };
  if (status === "finish") {
    newGameState.status = "Picking Teammate";
    newGameState.biddingPhase = null;
  } else {
    newGameState.biddingPhase = next;
  }
  return newGameState;
}

/**
 * Flushes all the changes into the database
 */
async function updateDatabase(
  gameRoomRef: DocumentReference<GameRoom>,
  state: GameState
) {
  await gameRoomRef.update({ state });
}

export const placeBid = functions.https.onCall(
  async (
    { bidRequest, gameId }: { bidRequest: BidRequest; gameId: string },
    context
  ) => {
    const uid = getUidOrThrow(context);

    const gameRoomRef = GAME_ROOMS_COLLECTION.doc(gameId);
    const gameRoom = await getGameRoomOrThrow(gameRoomRef);
    const gameState = gameRoom.state;
    const biddingPhase = getBiddingPhaseOrThrow(gameState);

    const gameRoomPlayerRef = gameRoomRef
      .collection("players")
      .doc(uid) as DocumentReference<GameRoomPlayer>;
    const gameRoomPlayer = await getPlayerInRoomOrThrow(gameRoomPlayerRef);

    requirePlayerTurn(biddingPhase, gameRoomPlayer);
    requirePassOrHigherBid(biddingPhase, bidRequest);

    const bidResult = handleLogic(biddingPhase, uid, bidRequest);
    const newGameState = updateGameState(gameState, bidResult);
    await updateDatabase(gameRoomRef, newGameState);

    return bidResult;
  }
);
