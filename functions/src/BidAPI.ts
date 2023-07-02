import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Bid } from "types/Bid";
import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { GameState, TrickTakingPhaseHidden } from "types/GameState";
import { GamePlayer, PlayerProfile } from "types/PlayerProfile";
import { produce } from "immer";
import { Card } from "types/Card";

export const placeBid = functions.https.onCall(async (bid: Bid, context) => {
  // 0. Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The user is not authenticated.");
  }
  //Get the user's playerProfile to get their roomID
  const playerProfileRef = admin
    .firestore()
    .collection("playerProfiles")
    .doc(context.auth.uid) as DocumentReference<PlayerProfile>;
  const playerProfile = (await playerProfileRef.get()).data();

  if (!playerProfile) {
    throw new functions.https.HttpsError("not-found", "Couldn't find your player profile.");
  }

  if (!playerProfile.roomID) {
    throw new functions.https.HttpsError("failed-precondition", "You are not in a room.");
  }

  // Get the user's room
  const gameRoomRef = admin
    .firestore()
    .collection("gameRooms")
    .doc(playerProfile.roomID) as DocumentReference<GameState>;

  const gameRoom = (await gameRoomRef.get()).data();

  if (!gameRoom) {
    throw new functions.https.HttpsError("not-found", "This room does not exist.");
  }

  // 1. Check if the game is in the bidding phase
  if (gameRoom.status !== "Bidding") {
    throw new functions.https.HttpsError("failed-precondition", "The game is not in the bidding phase.");
  }

  if (!gameRoom.biddingPhase) {
    throw new functions.https.HttpsError("failed-precondition", "Can't find the bidding phase.");
  }

  // 2. Check if the player is in the room
  const gameRoomPlayerRef = gameRoomRef.collection("players").doc(context.auth.uid) as DocumentReference<GamePlayer>;
  const gameRoomPlayerSnapshot = await gameRoomPlayerRef.get();
  const gameRoomPlayer = gameRoomPlayerSnapshot.data();

  if (!gameRoomPlayer) {
    throw new functions.https.HttpsError("failed-precondition", "Player is not in the room.");
  }

  // 3. Check if it's the player's turn
  if (gameRoomPlayer.position !== gameRoom.biddingPhase!.currentPlayerIndex) {
    throw new functions.https.HttpsError("failed-precondition", "It's not the player's turn to place a bid.");
  }

  // 4. Check if the bid is valid
  const updatedGameRoom = produce(gameRoom, (gameRoom) => {
    const biddingPhase = gameRoom.biddingPhase!;

    if (bid.isPass) {
      biddingPhase.numPasses += 1;
      biddingPhase.bidHistory.at(-1)![`p${gameRoomPlayer.position}` as "p0" | "p1" | "p2" | "p3"].bid = bid;

      if (biddingPhase.numPasses === 4) {
        // Reset game state
        return;
      }
      if (biddingPhase.numPasses === 3 && biddingPhase.highestBid) {
        gameRoom.status = "Choosing Teammate";
      }
    }

    if (!bid.isPass) {
      biddingPhase.numPasses = 0;
      biddingPhase.highestBid = bid;
      // Add the player bid into bidHistory
      biddingPhase.bidHistory.at(-1)![`p${gameRoomPlayer.position}` as "p0" | "p1" | "p2" | "p3"].bid = bid;
    }

    // If the player is the last one to bid, add a new bidHistory
    if (gameRoomPlayer.position === 3) {
      biddingPhase.bidHistory.push({
        p0: {
          info: {
            id: gameRoomPlayer.id,
            displayName: gameRoomPlayer.displayName,
          },
          bid: null,
        },
        p1: {
          info: {
            id: biddingPhase.gameroomPlayersList[0].id,
            displayName: biddingPhase.gameroomPlayersList[0].displayName,
          },
          bid: null,
        },
        p2: {
          info: {
            id: biddingPhase.gameroomPlayersList[1].id,
            displayName: biddingPhase.gameroomPlayersList[1].displayName,
          },
          bid: null,
        },
        p3: {
          info: {
            id: biddingPhase.gameroomPlayersList[2].id,
            displayName: biddingPhase.gameroomPlayersList[2].displayName,
          },
          bid: null,
        },
      });
    }
    // Increment the current player index, modulo 4
    biddingPhase.currentPlayerIndex = ((biddingPhase.currentPlayerIndex + 1) % 4) as 0 | 1 | 2 | 3;
  });
  console.log(JSON.stringify(updatedGameRoom.biddingPhase));

  // 5. Update the game room
  await gameRoomRef.set(updatedGameRoom);
});

export const chooseTeammate = functions.https.onCall(async (card: Card, context) => {
  // 0. Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You are not authenticated.");
  }
  //Get the user's playerProfile to get their roomID
  const playerProfileRef = admin
    .firestore()
    .collection("playerProfiles")
    .doc(context.auth.uid) as DocumentReference<PlayerProfile>;
  const playerProfile = (await playerProfileRef.get()).data();

  if (!playerProfile) {
    throw new functions.https.HttpsError("not-found", "Couldn't find your player profile.");
  }

  if (!playerProfile.roomID) {
    throw new functions.https.HttpsError("failed-precondition", "You are not in a room.");
  }

  // Get the user's room
  const gameRoomRef = admin
    .firestore()
    .collection("gameRooms")
    .doc(playerProfile.roomID) as DocumentReference<GameState>;

  const gameRoom = (await gameRoomRef.get()).data();

  if (!gameRoom) {
    throw new functions.https.HttpsError("not-found", "This room does not exist.");
  }

  // 1. Check if the game is in the bidding phase
  if (gameRoom.status !== "Choosing Teammate") {
    throw new functions.https.HttpsError("failed-precondition", "You can't choose your teammate now.");
  }

  if (!gameRoom.biddingPhase) {
    throw new functions.https.HttpsError("failed-precondition", "Can't find bidding phase.");
  }

  // 2. Check if the player is in the room
  const gamePlayerListRef = gameRoomRef.collection("players") as CollectionReference<GamePlayer>;

  // Get the list of GamePlayer from the room
  const gamePlayerListSnapshot = await gamePlayerListRef.get();
  const gamePlayerList = gamePlayerListSnapshot.docs.map((doc) => doc.data());

  const gamePlayer = gamePlayerList.find((gamePlayer) => gamePlayer.id === context.auth!.uid);

  if (!gamePlayer) {
    throw new functions.https.HttpsError("failed-precondition", "You are not in this room.");
  }

  // 3. Check if it's the player's turn
  if (gamePlayer.position !== gameRoom.biddingPhase!.currentPlayerIndex) {
    throw new functions.https.HttpsError("failed-precondition", "It's not your turn to choose your teammate.");
  }

  // 4. Check whether the player doesn't own this card by checking if the card is in the player's hand
  if (gamePlayer.cards.includes(card)) {
    throw new functions.https.HttpsError("failed-precondition", "You can't choose your own card!");
  }

  // 5. Find the player who owns the card, and put them in the same team as the player, then place the remaining 2 players in the other team
  const teammate = gamePlayerList.find(
    (gamePlayer) =>
      gamePlayer.cards.findIndex(
        (gamePlayerCard) => gamePlayerCard.suit === card.suit && gamePlayerCard.value === card.value
      ) !== -1
  )!;

  // Find the remaining 2 players
  const otherPlayers = gamePlayerList.filter((plyr) => plyr.id !== teammate.id && plyr.id !== gamePlayer.id);

  console.log({
    gamePlayerList,
    gamePlayer,
    teammate,
    otherPlayers,
    biddingPhase: gameRoom.biddingPhase,
  });
  (await gamePlayerListRef.listDocuments()).forEach(async (doc) => {
    const isDeclarerTeam = doc.id === gamePlayer.id || doc.id === teammate.id;
    const isDefenderTeam = doc.id === otherPlayers[0].id || doc.id === otherPlayers[1].id;

    if (isDeclarerTeam) {
      await doc.update({ team: "Declarer" });
    }
    if (isDefenderTeam) {
      await doc.update({ team: "Defender" });
    }
  });

  const updatedGameRoom = produce(gameRoom, (gameRoom) => {
    gameRoom.status = "Taking Trick";
    const leadPlayerIndex = ((gameRoom.biddingPhase!.currentPlayerIndex + 1) % 4) as 0 | 1 | 2 | 3;

    gameRoom.trickTakingPhase = {
      currentPlayerIndex: leadPlayerIndex,
      gameroomPlayersList: gameRoom.biddingPhase!.gameroomPlayersList,
      leadPlayerIndex: leadPlayerIndex,
      trumpSuit: gameRoom.biddingPhase!.highestBid!.suit,
    };

    gameRoom.biddingPhase = null;
  });

  console.log({ updatedGameRoom });

  // 6. Create hiddenTrickPhase

  const highestBid = gameRoom.biddingPhase!.highestBid!;
  const hiddenTrickPhase: TrickTakingPhaseHidden = {
    declarerTeam: {
      playerList: [gamePlayer, teammate],
      tricksWon: 0,
      tricksNeeded: 6 + highestBid.number,
    },
    defenderTeam: {
      playerList: otherPlayers,
      tricksWon: 0,
      tricksNeeded: 7 - highestBid.number,
    },
  };

  await gameRoomRef.collection("hiddenTrickPhase").doc("hiddenTrickPhase").set(hiddenTrickPhase);

  await gameRoomRef.set(updatedGameRoom);
});
