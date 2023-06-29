import * as functions from "firebase-functions";

import { CallableContext, HttpsError } from "firebase-functions/v1/https";
import { Bid } from "types/Bid";
import {DocumentReference} from "firebase-admin/firestore";
// import {BiddingPhase, GameState} from "types/GameState";
import {GameRoomPlayer} from "types/PlayerProfile";
import {BidSuit} from "types/Bid";
import { GAME_ROOMS_COLLECTION } from "./colllections";
import { BiddingPhase, GameState } from "./GameType";

// TODO: Redifined the API
// TODO: write wrapper for the DB

function getUidOrThrow(context: CallableContext): string {
  if (!context.auth) {
    throw new HttpsError("unauthenticated", "The user is not authenticated");
  }
  return context.auth.uid;
}

async function getGameStateOrThrow(
  gameStateRef: DocumentReference<GameState>
): Promise<GameState> {
  const gameStateSnapshot = await gameStateRef.get();
  const gameState = gameStateSnapshot.data();
  if (!gameState) {
    throw new HttpsError("not-found", "The game does not exist");
  }
  return gameState;
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
    throw new HttpsError("failed-precondition", "The game must be in bidding phase");
  }
  return biddingPhase;
}

function requirePlayerTurn(biddingPhase: BiddingPhase, gameRoomPlayer: GameRoomPlayer) {
  const { position } = gameRoomPlayer;
  const { currentPlayerIndex } = biddingPhase;
  if (position !== currentPlayerIndex) {
    throw new HttpsError("failed-precondition", "It's not this player turn");
  }
}

function requireHiggerBid(biddingPhase: BiddingPhase, bid: Bid) {
  const { highestBid } = biddingPhase;
  if (highestBid !== null && bidComparator(bid, highestBid) <= 0) {
    throw new HttpsError("failed-precondition", "New bid should be greater than the highest bid");
  }
}

/**
 * The bidding phase will end when: 3 consecutive people passed
 */
function handleLogic(
  biddingPhase: BiddingPhase, 
  playerID: string,
  bid: Bid): BiddingPhase {
  
  let { currentPlayerIndex, numberOfPasses, highestBid } = biddingPhase;
  if (bid.isPass) {
    numberOfPasses++;
  }
  if (numberOfPasses === 4) {
    // the bidding phase is terminated
    // return
  } else if (numberOfPasses === 3 && highestBid) {
    // the bidding phase will end, and the player play that will win
    // return
  }
  // increment the player indicies
  // 
  if (bid.isPass) {
    return { ...biddingPhase, numberOfPasses };
  } else {
    // we need to update the highest bid
    return { ...biddingPhase, highestBid: { ...bid,  };
  }
}

/**
 * Flushes all the changes into the database
 */
function update() {

}

export const placeBid = functions.https.onCall(async ({ bid, gameId }: { bid: Bid, gameId: string }, context) => {
  const uid = getUidOrThrow(context);
  const gameStateRef = GAME_STATES_COLLECTION.doc(gameId) as DocumentReference<GameState>;
  
  const gameState = await getGameStateOrThrow(gameStateRef);
  const biddingPhase = getBiddingPhaseOrThrow(gameState);

  const gameRoomPlayerRef = gameStateRef
    .collection("players")
    .doc(uid) as DocumentReference<GameRoomPlayer>;

  const gameRoomPlayer = await getPlayerInRoomOrThrow(gameRoomPlayerRef);
  
  requirePlayerTurn(biddingPhase, gameRoomPlayer);
  requireHiggerBid(biddingPhase, bid);

  // TODO: Perform the bid placement logic here
  /**
   * What are the updates that we need to execute on each bid?
   * - Update the highest bid
   * - Update the number of consecutive pass
   * - Take actions based on the number of consecutives passes
   * - 
   */
  const nextBiddingPhase = handleLogic(biddingPhase, bid);
  
  // TODO: write io logic here
  /**
   * Upload the modified state into the database
   */
  update();
  return nextBiddingPhase; // TODO: Return any desired response
});

const bidComparator = (bid1: Bid, bid2: Bid) => {
  const suitOrder: BidSuit[] = ["♣", "♦", "♥", "♠", "NT"];

  if (bid1.suit === bid2.suit) {
    return bid1.number - bid2.number;
  }

  return suitOrder.indexOf(bid1.suit) - suitOrder.indexOf(bid1.suit);
};
