import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {Bid} from "types/Bid";
import {DocumentReference} from "firebase-admin/firestore";
import {GameRoom} from "types/GameRoom";
import {GameRoomPlayer} from "types/PlayerProfile";

export const placeBid = functions.https.onCall(async (bid: Bid, context) => {
  // 0. Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The user is not authenticated."
    );
  }

  // Get the user's profile
  const gameRoomRef = admin
    .firestore()
    .collection("playerProfiles")
    .doc(context.auth.uid) as DocumentReference<GameRoom>;

  const gameRoom = (await gameRoomRef.get()).data();

  if (!gameRoom) {
    throw new functions.https.HttpsError(
      "not-found",
      "This room does not exist."
    );
  }

  // 1. Check if the game is in the bidding phase
  if (gameRoom.status !== "Bidding") {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The game is not in the bidding phase."
    );
  }

  // 2. Check if the player is in the room
  const playerRef = gameRoomRef
    .collection("players")
    .doc(context.auth.uid) as DocumentReference<GameRoomPlayer>;
  const playerSnapshot = await playerRef.get();
  const playerData = playerSnapshot.data();

  if (!playerData) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Player is not in the room."
    );
  }

  // 3. Check if it's the player's turn
  if (playerData.position !== gameRoom.biddingPhase!.currentBidderIndex) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "It's not the player's turn to place a bid."
    );
  }

  // 4. Check if the bid is smaller than the highest bid
  const highestBid = gameRoom.biddingPhase!.highestBid;

  const isFirstBid = !highestBid;
  const isValidBid = isFirstBid || bid.largerThan(highestBid);

  if (isValidBid) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The bid must be greater than the highest bid."
    );
  }

  // TODO: Perform the bid placement logic here

  return null; // TODO: Return any desired response
});
