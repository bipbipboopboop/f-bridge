import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { CallableContext, HttpsError } from "firebase-functions/v1/https";
import { Bid } from "types/Bid";
import {DocumentReference} from "firebase-admin/firestore";
import {GameState} from "types/GameState";
import {GameRoomPlayer} from "types/PlayerProfile";
import {BidSuit} from "types/Bid";
import { PLAYERS_COLLECTION, GAME_STATES_COLLECTION } from "./colllections";

function getUidOrThrow(context: CallableContext): string {
  if (!context.auth) {
    throw new HttpsError("unauthenticated", "The user is not authenticated");
  }
  return context.auth.uid;
}

async function getGameStateOrThrow(gameStateRef: DocumentReference<GameState>): Promise<GameState> {
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

function requireBiddingPhase(gameState: GameState) {
  if (gameState.status !== "Bidding") {
    throw new HttpsError("failed-precondition", "The game must be in bidding phase");
  }
}

function requirePlayerTurn() {

}

function requireHiggerBid() {

}


export const placeBid = functions.https.onCall(async ({ bid, gameId }: { bid: Bid, gameId: string }, context) => {
  // 0. Check if the user is authenticated
  const uid = getUidOrThrow(context);

  // Get the user's profile
  const gameStateRef = GAME_STATES_COLLECTION.doc(gameId) as DocumentReference<GameState>;
  const gameState = await getGameStateOrThrow(gameStateRef);

  // 1. Check if the game is in the bidding phase
  requireBiddingPhase(gameState);

  // 2. Check if the player is in the room
  const gameRoomPlayerRef = gameStateRef
    .collection("players")
    .doc(uid) as DocumentReference<GameRoomPlayer>;

  const gameRoomPlayer = await getPlayerInRoomOrThrow(gameRoomPlayerRef);
  requirePlayerTurn();
  requireHiggerBid();


  // 3. Check if it's the player's turn
  // if (gameRoomPlayer.position !== gameState.biddingPhase!.currentPlayerIndex) {
  //   throw new functions.https.HttpsError(
  //     "failed-precondition",
  //     "It's not the player's turn to place a bid."
  //   );
  // }

  // 4. Check if the bid is smaller than the highest bid
  // const highestBid = gameRoom.biddingPhase!.highestBid;

  // const isFirstBid = !highestBid;
  // const isHighestBid = isFirstBid || bidComparator(bid, highestBid!) === 1;

  // if (!isHighestBid) {
  //   throw new functions.https.HttpsError(
  //     "failed-precondition",
  //     "The bid must be greater than the highest bid."
  //   );
  // }
    
  // TODO: Perform the bid placement logic here
  
  /**
   * What are the updates that we need to execute on each bid?
   * - Update the highest bid
   * - Update the number of consecutive pass
   * - Take actions based on the number of consecutives passes
   * - 
   */

  return null; // TODO: Return any desired response
});

const bidComparator = (bid1: Bid, bid2: Bid) => {
  const suitOrder: BidSuit[] = ["♣", "♦", "♥", "♠", "NT"];

  if (bid1.suit === bid2.suit) {
    return bid1.number - bid2.number;
  }

  return suitOrder.indexOf(bid1.suit) - suitOrder.indexOf(bid1.suit);
};
