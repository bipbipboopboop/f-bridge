import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { produce } from "immer";

import { RestrictedAccountInfo } from "types/Account";
import { Bid, BidSuit } from "types/Bid";
import { PublicBiddingPhase, PrivateTrickTakingPhase, RestrictedPlayerData } from "types/GameState";
import { PublicPlayer } from "types/Player";
import { GameRoom } from "types/Room";

import { shuffleCards } from "./utils/shuffle_cards";
import { Card } from "types/Card";

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

  if (gameRoom.status !== "Bidding") {
    throw new functions.https.HttpsError("failed-precondition", "The game is not in the bidding phase.");
  }

  const publicBiddingPhaseRef = gameRoomRef.collection("publicGameState").doc("biddingPhase");
  const publicBiddingPhaseSnapshot = await publicBiddingPhaseRef.get();
  const publicBiddingPhase = publicBiddingPhaseSnapshot.data() as PublicBiddingPhase;

  if (!publicBiddingPhaseSnapshot.exists || !publicBiddingPhase) {
    throw new functions.https.HttpsError("failed-precondition", "Can't find the bidding phase.");
  }

  const currentPlayerIndex = publicBiddingPhase.currentPlayerIndex;
  const currentPlayer = publicBiddingPhase.players[currentPlayerIndex];

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
    updatedGameStatus = "Choosing Teammate";
  } else if (updatedPublicBiddingPhase.numPasses === 4) {
    await resetBiddingPhase(gameRoomRef, updatedPublicBiddingPhase.players);
    return;
  }

  await publicBiddingPhaseRef.set(updatedPublicBiddingPhase);
  await gameRoomRef.update({
    status: updatedGameStatus,
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

  const publicBiddingPhaseRef = gameRoomRef.collection("publicGameState").doc("biddingPhase");
  const publicBiddingPhaseSnapshot = await publicBiddingPhaseRef.get();
  const publicBiddingPhase = publicBiddingPhaseSnapshot.data() as PublicBiddingPhase;

  if (!publicBiddingPhaseSnapshot.exists || !publicBiddingPhase) {
    throw new functions.https.HttpsError("failed-precondition", "Can't find the bidding phase.");
  }

  const currentPlayerIndex = publicBiddingPhase.currentPlayerIndex;
  const currentPlayer = publicBiddingPhase.players[currentPlayerIndex];

  if (currentPlayer.id !== context.auth.uid) {
    throw new functions.https.HttpsError("failed-precondition", "It's not your turn to choose your teammate.");
  }

  const restrictedPlayersRef = gameRoomRef.collection("restrictedPlayers");
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
  const otherPlayers = publicBiddingPhase.players.filter(
    (player) => player.id !== currentPlayer.id && player.id !== teammate.id
  );

  const declarerTeam: PublicPlayer[] = [
    currentPlayer,
    publicBiddingPhase.players.find((player) => player.id === teammate.id)!,
  ];
  const defenderTeam: PublicPlayer[] = otherPlayers;

  await restrictedPlayersRef.doc(currentPlayer.id).update({ team: "Declarer" });
  await restrictedPlayersRef.doc(teammate.id).update({ team: "Declarer" });
  await Promise.all(otherPlayers.map((player) => restrictedPlayersRef.doc(player.id).update({ team: "Defender" })));

  const highestBid = publicBiddingPhase.highestBid!;
  const privateTrickTakingPhase: PrivateTrickTakingPhase = {
    currentPlayerIndex: ((currentPlayerIndex + 1) % 4) as 0 | 1 | 2 | 3,
    leadPlayerIndex: ((currentPlayerIndex + 1) % 4) as 0 | 1 | 2 | 3,
    trumpSuit: highestBid.suit as BidSuit,
    players: publicBiddingPhase.players,
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
  };

  await gameRoomRef.collection("privateGameState").doc("trickTakingPhase").set(privateTrickTakingPhase);
  await gameRoomRef.collection("publicGameState").doc("trickTakingPhase").set({
    currentPlayerIndex: privateTrickTakingPhase.currentPlayerIndex,
    leadPlayerIndex: privateTrickTakingPhase.leadPlayerIndex,
    trumpSuit: privateTrickTakingPhase.trumpSuit,
    players: privateTrickTakingPhase.players,
  });

  await publicBiddingPhaseRef.delete();
  await gameRoomRef.update({ status: "Taking Trick" });
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

async function resetBiddingPhase(gameRoomRef: DocumentReference<GameRoom>, players: PublicBiddingPhase["players"]) {
  const deck = shuffleCards();
  const restrictedPlayersRef = gameRoomRef.collection("restrictedPlayers");

  for (const playerDoc of players) {
    const playerCards = deck.splice(0, 13);
    await restrictedPlayersRef.doc(playerDoc.id).update({ cards: playerCards });
  }

  const publicBiddingPhaseRef = gameRoomRef.collection("publicGameState").doc("biddingPhase");
  await publicBiddingPhaseRef.set({
    currentPlayerIndex: 0,
    numPasses: 0,
    highestBid: null,
    bidHistory: [],
    players: players,
  });
}
