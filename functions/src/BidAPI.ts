import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { CollectionReference, DocumentReference, Timestamp } from "firebase-admin/firestore";
import { produce } from "immer";

import { RestrictedAccountInfo } from "types/Account";
import { Bid, BidSuit } from "types/Bid";
import {
  PublicBiddingPhase,
  PrivateTrickTakingPhase,
  RestrictedPlayerData,
  PublicTrickTakingPhase,
  PublicTeammateChoosingPhase,
} from "types/GameState";
import { PublicPlayer } from "types/Player";
import { GameRoom } from "types/Room";

import { shuffleCards } from "./utils/shuffle_cards";
import { Card } from "types/Card";
import { UnauthenticatedError } from "./error/error";
import { Announcement } from "types/Annoucement";
import { Message } from "types/Message";
import { findLastIndex } from "lodash";

export const placeBid = functions.region("asia-east2").https.onCall(async (bid: Bid, context) => {
  if (!context.auth) {
    throw UnauthenticatedError;
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

  if (gameRoom.status !== "Bidding") {
    throw new functions.https.HttpsError("failed-precondition", "The game is not in the bidding phase.");
  }

  const publicBiddingPhase = gameRoom.phase.biddingPhase;

  if (!publicBiddingPhase) {
    throw new functions.https.HttpsError("failed-precondition", "Can't find the bidding phase.");
  }

  const currentPlayerIndex = publicBiddingPhase.currentPlayerIndex;
  const currentPlayer = gameRoom.players[currentPlayerIndex];

  if (currentPlayer.id !== context.auth.uid) {
    throw new functions.https.HttpsError("failed-precondition", "You are not the current player.");
  }

  const isPass = bid.suit === "Pass";
  const isValidBid = !isPass && isBidValid(bid, publicBiddingPhase.highestBid);

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
    // Find the bid winner based on the highest bid in bidHistory
    const highestBidIndex = findLastIndex(
      updatedPublicBiddingPhase.bidHistory,
      (bidEntry) =>
        bidEntry.level === updatedPublicBiddingPhase.highestBid!.level &&
        bidEntry.suit === updatedPublicBiddingPhase.highestBid!.suit
    );

    // If the highest bid is NT, the bid winner is the last player who bid NT
    const bidWinnerIndex =
      updatedPublicBiddingPhase.highestBid!.suit === "NT"
        ? updatedPublicBiddingPhase.bidHistory.length - 1
        : highestBidIndex;

    // Calculate the position of the bid winner
    const bidWinnerPosition = (bidWinnerIndex + 1) % 4;

    // Set up PublicTeammateChoosingPhase when there are 3 consecutive passes
    const publicTeammateChoosingPhase: PublicTeammateChoosingPhase = {
      currentPlayerIndex: bidWinnerPosition as 0 | 1 | 2 | 3,
      chosenCard: null,
      highestBid: updatedPublicBiddingPhase.highestBid,
    };

    await gameRoomRef.update({
      status: "Choosing Teammate",
      "phase.biddingPhase": null,
      "phase.teammateChoosingPhase": publicTeammateChoosingPhase,
    });

    return;
  } else if (updatedPublicBiddingPhase.numPasses === 4) {
    await resetBiddingPhase(gameRoomRef, gameRoom.players);
    return;
  }

  await gameRoomRef.update({
    status: updatedGameStatus,
    "phase.biddingPhase": updatedPublicBiddingPhase,
  });
});

export const chooseTeammate = functions.region("asia-east2").https.onCall(async (card: Card, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You are not authenticated.");
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

  if (gameRoom.status !== "Choosing Teammate") {
    throw new functions.https.HttpsError("failed-precondition", "You can't choose your teammate now.");
  }

  const publicTeammateChoosingPhase = gameRoom.phase.teammateChoosingPhase;

  if (!publicTeammateChoosingPhase) {
    throw new functions.https.HttpsError("failed-precondition", "Can't find the teammate choosing phase.");
  }

  const currentPlayerIndex = publicTeammateChoosingPhase.currentPlayerIndex;
  const currentPlayer = gameRoom.players[currentPlayerIndex];

  if (currentPlayer.id !== context.auth.uid) {
    throw new functions.https.HttpsError("failed-precondition", "It's not your turn to choose your teammate.");
  }

  const restrictedPlayersRef = gameRoomRef.collection("restrictedPlayerCards");
  const currentPlayerRestrictedDataSnapshot = await restrictedPlayersRef.doc(currentPlayer.id).get();
  const currentPlayerRestrictedData = currentPlayerRestrictedDataSnapshot.data() as RestrictedPlayerData;

  if (!currentPlayerRestrictedDataSnapshot.exists || !currentPlayerRestrictedData) {
    throw new functions.https.HttpsError("failed-precondition", "Can't find your restricted player data.");
  }

  if (currentPlayerRestrictedData.cards.some((c) => c.suit === card.suit && c.rank === card.rank)) {
    throw new functions.https.HttpsError("failed-precondition", "You can't choose your own card!");
  }

  const teammateSnapshot = await restrictedPlayersRef.where("cards", "array-contains", card).limit(1).get();

  if (teammateSnapshot.empty) {
    throw new functions.https.HttpsError("failed-precondition", "No player has the chosen card.");
  }

  const teammate = teammateSnapshot.docs[0].data() as RestrictedPlayerData;
  const otherPlayers = gameRoom.players.filter((player) => player.id !== currentPlayer.id && player.id !== teammate.id);

  const declarerTeam: PublicPlayer[] = [currentPlayer, gameRoom.players.find((player) => player.id === teammate.id)!];
  const defenderTeam: PublicPlayer[] = otherPlayers;

  await restrictedPlayersRef.doc(currentPlayer.id).update({ team: "Declarer" });
  await restrictedPlayersRef.doc(teammate.id).update({ team: "Declarer" });
  await Promise.all(otherPlayers.map((player) => restrictedPlayersRef.doc(player.id).update({ team: "Defender" })));

  const highestBid = publicTeammateChoosingPhase.highestBid!;
  const privateTrickTakingPhase: PrivateTrickTakingPhase = {
    currentPlayerIndex: ((currentPlayerIndex + 1) % 4) as 0 | 1 | 2 | 3,
    leadPlayerIndex: ((currentPlayerIndex + 1) % 4) as 0 | 1 | 2 | 3,
    trumpSuit: highestBid.suit as BidSuit,
    defenderTeam: {
      tricksWon: 0,
      tricksNeeded: 13 - (6 + highestBid.level),
      players: defenderTeam,
    },
    declarerTeam: {
      tricksWon: 0,
      tricksNeeded: 6 + highestBid.level,
      players: declarerTeam,
    },
    declarerTricksNeeded: 6 + highestBid.level,
    defenderTricksNeeded: 13 - (6 + highestBid.level),
  };

  const publicTrickTakingPhase: PublicTrickTakingPhase = {
    currentPlayerIndex: privateTrickTakingPhase.currentPlayerIndex,
    leadPlayerIndex: privateTrickTakingPhase.leadPlayerIndex,
    trumpSuit: privateTrickTakingPhase.trumpSuit,
    declarerTricksNeeded: privateTrickTakingPhase.declarerTricksNeeded,
    defenderTricksNeeded: privateTrickTakingPhase.defenderTricksNeeded,
  };

  const announcement: Announcement = {
    id: Timestamp.now().toMillis().toString(),
    title: "Teammate Chosen",
    content: `${currentPlayer.displayName} has chosen ${card.rank} ${card.suit} as their teammate.`,
    createdAt: Timestamp.now().toDate(),
  };

  await gameRoomRef.collection("privateGameState").doc("trickTakingPhase").set(privateTrickTakingPhase);
  await gameRoomRef.update({
    status: "Taking Trick",
    "phase.teammateChoosingPhase": null,
    "phase.trickTakingPhase": publicTrickTakingPhase,
    announcements: [...gameRoom.announcements, announcement], // Add the announcement to the announcements array
  });

  // Add the teammate chosen message to the messages collection
  const messagesRef = gameRoomRef.collection("messages") as CollectionReference<Message>;
  await messagesRef.add({
    createdAt: Timestamp.now(),
    playerName: "system",
    text: `${currentPlayer.displayName} has chosen ${card.rank} ${card.suit} as their teammate.`,
    uid: "system",
  });
});

function isBidValid(bid: Bid, highestBid: Bid | null): boolean {
  if (!highestBid) {
    return true;
  }

  const suitOrder: BidSuit[] = ["♣", "♦", "♥", "♠", "NT"];

  if (bid.level > highestBid.level) {
    return true;
  } else if (bid.level === highestBid.level) {
    return suitOrder.indexOf(bid.suit) > suitOrder.indexOf(highestBid.suit);
  }

  return false;
}

async function resetBiddingPhase(gameRoomRef: DocumentReference<GameRoom>, players: PublicPlayer[]) {
  const deck = shuffleCards();
  const restrictedPlayersRef = gameRoomRef.collection("restrictedPlayerCards");

  for (const player of players) {
    const playerCards = deck.splice(0, 13);
    await restrictedPlayersRef.doc(player.id).update({ cards: playerCards });
  }

  const publicBiddingPhaseData: PublicBiddingPhase = {
    currentPlayerIndex: 0,
    numPasses: 0,
    highestBid: null,
    bidHistory: [],
  };

  await gameRoomRef.update({
    "phase.biddingPhase": publicBiddingPhaseData,
  });
}
