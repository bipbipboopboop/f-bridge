import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { produce } from "immer";

import { Bid } from "types/Bid";
import { RestrictedAccountInfo } from "types/Account";
import { GameRoom } from "types/Room";
import { PublicBiddingPhase } from "types/GameState";
import { shuffleCards } from "./utils/shuffle_cards";

export const placeBid = functions.region("asia-east2").https.onCall(async (bid: Bid, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The user is not authenticated.");
  }

  const playerAccountRef = admin
    .firestore()
    .collection("accounts")
    .doc(context.auth.uid) as DocumentReference<RestrictedAccountInfo>;
  const playerAccount = (await playerAccountRef.get()).data();

  if (!playerAccount) {
    throw new functions.https.HttpsError("not-found", "Couldn't find your player account.");
  }

  if (!playerAccount.roomID) {
    throw new functions.https.HttpsError("failed-precondition", "You are not in a room.");
  }

  const gameRoomRef = admin
    .firestore()
    .collection("gameRooms")
    .doc(playerAccount.roomID) as DocumentReference<GameRoom>;
  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoom = gameRoomSnapshot.data();

  if (!gameRoomSnapshot.exists || !gameRoom) {
    throw new functions.https.HttpsError("not-found", "This room does not exist.");
  }

  // 1. Check if the game is in the bidding phase
  if (gameRoom.status !== "Bidding") {
    throw new functions.https.HttpsError("failed-precondition", "The game is not in the bidding phase.");
  }

  const publicBiddingPhaseRef = gameRoomRef.collection("publicGameState").doc("biddingPhase");
  const publicBiddingPhaseSnapshot = await publicBiddingPhaseRef.get();
  const publicBiddingPhase = publicBiddingPhaseSnapshot.data() as PublicBiddingPhase;

  if (!publicBiddingPhaseSnapshot.exists || !publicBiddingPhase) {
    throw new functions.https.HttpsError("failed-precondition", "Can't find the bidding phase.");
  }

  // 2. Check if the player is in the room
  const currentPlayerIndex = publicBiddingPhase.currentPlayerIndex;
  const currentPlayer = publicBiddingPhase.players[currentPlayerIndex];

  if (currentPlayer.id !== context.auth.uid) {
    throw new functions.https.HttpsError("failed-precondition", "You are not the current player.");
  }

  // 3. Check if it's the player's turn
  if (currentPlayer.id !== context.auth.uid) {
    throw new functions.https.HttpsError("failed-precondition", "It's not your turn to place a bid.");
  }

  // 4. Check if the bid is valid
  const isPass = bid.suit === "Pass";
  const isValidBid =
    !isPass &&
    (!publicBiddingPhase.highestBid ||
      bid.level > publicBiddingPhase.highestBid.level ||
      (bid.level === publicBiddingPhase.highestBid.level && bid.suit > publicBiddingPhase.highestBid.suit));

  if (!isPass && !isValidBid) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Invalid bid. The bid must be higher than the current highest bid."
    );
  }

  const updatedPublicBiddingPhase = produce(publicBiddingPhase, (draft) => {
    draft.bidHistory.push(bid);

    if (isPass) {
      draft.numPasses++;
    } else {
      draft.highestBid = bid;
      draft.numPasses = 0;
    }

    draft.currentPlayerIndex = ((currentPlayerIndex + 1) % 4) as 0 | 1 | 2 | 3;
  });

  let updatedGameStatus: GameRoom["status"] = gameRoom.status;

  if (updatedPublicBiddingPhase.numPasses === 3 && updatedPublicBiddingPhase.highestBid) {
    // Declare bid winner when there are 3 consecutive passes
    updatedGameStatus = "Choosing Teammate";
  } else if (updatedPublicBiddingPhase.numPasses === 4) {
    // Reshuffle everyone's cards if everyone passes
    const deck = shuffleCards();
    const restrictedPlayersRef = gameRoomRef.collection("restrictedPlayers");

    for (const playerDoc of updatedPublicBiddingPhase.players) {
      const playerCards = deck.splice(0, 13);
      await restrictedPlayersRef.doc(playerDoc.id).update({ cards: playerCards });
    }

    // Reset the bidding phase
    await publicBiddingPhaseRef.set({
      currentPlayerIndex: 0,
      numPasses: 0,
      highestBid: null,
      bidHistory: [],
      players: updatedPublicBiddingPhase.players,
    });

    return;
  }

  await publicBiddingPhaseRef.set(updatedPublicBiddingPhase);
  await gameRoomRef.update({
    status: updatedGameStatus,
  });
});
