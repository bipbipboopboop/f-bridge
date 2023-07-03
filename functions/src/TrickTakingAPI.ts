import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { CollectionReference, DocumentReference, Timestamp } from "firebase-admin/firestore";
import { EndedPhase, GameRoom, TrickTakingPhaseHidden } from "types/GameRoom";
import { GamePlayer, PlayerProfile } from "types/PlayerProfile";
import { produce } from "immer";
import { Card } from "types/Card";
import { Message } from "types/Chat";

export const playCard = functions.region("asia-east2").https.onCall(async (card: Card, context) => {
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
    .doc(playerProfile.roomID) as DocumentReference<GameRoom>;

  const gameRoom = (await gameRoomRef.get()).data();

  if (!gameRoom) {
    throw new functions.https.HttpsError("not-found", "This room does not exist.");
  }

  // 1. Check if the game is in the trick taking phase
  if (gameRoom.status !== "Taking Trick") {
    throw new functions.https.HttpsError("failed-precondition", "You can't play cards in this phase.");
  }

  if (!gameRoom.trickTakingPhase) {
    throw new functions.https.HttpsError("failed-precondition", "You can't play cards in this phase.");
  }

  // 2. Check if the player is in the room
  const gamePlayerRef = gameRoomRef.collection("players").doc(context.auth.uid) as DocumentReference<GamePlayer>;
  const gamePlayerSnapshot = await gamePlayerRef.get();
  const gamePlayer = gamePlayerSnapshot.data();

  if (!gamePlayer) {
    throw new functions.https.HttpsError("failed-precondition", "Player is not in the room.");
  }

  if (!gameRoom.trickTakingPhase.gameroomPlayersList.find((player) => player.position === gamePlayer.position)) {
    throw new functions.https.HttpsError("failed-precondition", "Player is not in the room.");
  }

  // 3. Check if it's the player's turn
  if (gamePlayer.position !== gameRoom.trickTakingPhase!.currentPlayerIndex) {
    throw new functions.https.HttpsError("failed-precondition", "It's not your turn yet.");
  }

  // 4. Check if the card belongs to the player
  if (!gamePlayer.cards.find((playerCard) => playerCard.suit === card.suit && playerCard.value === card.value)) {
    throw new functions.https.HttpsError("failed-precondition", "You don't have this card.");
  }

  // 5. Check if the suit of the card is the same as the suit of the first card played, if not, check if the player has a card of the same suit
  // If the player is the leading player, then the suit of the card is the suit of the first card played and the player can play any card
  const leadPlayerIndex = gameRoom.trickTakingPhase!.leadPlayerIndex;
  const isLeadingPlayer = gamePlayer.position === leadPlayerIndex;
  if (!isLeadingPlayer) {
    const firstCardOnTable = gameRoom.trickTakingPhase!.gameroomPlayersList[leadPlayerIndex].currentCardOnTable!;
    if (firstCardOnTable.suit !== card.suit) {
      const hasCardOfSameSuit = gamePlayer.cards.some((card) => card.suit === firstCardOnTable.suit);
      if (hasCardOfSameSuit) {
        throw new functions.https.HttpsError("failed-precondition", `You must play a ${firstCardOnTable.suit} card.`);
      }
    }
  }

  // 5. Update the game room
  const newGameRoom = produce(gameRoom, (gameRoom) => {
    // Play the card in the player's hand

    const player = gameRoom.trickTakingPhase!.gameroomPlayersList.find(
      (player) => player.position === gamePlayer.position
    )!;

    player.currentCardOnTable = card;
    player.numCardsOnHand--;
    gameRoom.trickTakingPhase!.currentPlayerIndex = ((gameRoom.trickTakingPhase!.currentPlayerIndex + 1) % 4) as
      | 0
      | 1
      | 2
      | 3;
  });

  // 6. Remove the card from the player's hand
  const newGamePlayer = produce(gamePlayer, (gamePlayer) => {
    gamePlayer.cards = gamePlayer.cards.filter(
      (cardInHand) => !(cardInHand.value === card.value && cardInHand.suit === card.suit)
    );
    gamePlayer.numCardsOnHand--;
  });

  //   console.log({
  //     card,
  //     gamePlayer: JSON.stringify(gamePlayer),
  //     newGamePlayer: JSON.stringify(newGamePlayer),
  //     newGameRoom: JSON.stringify(newGameRoom),
  //   });

  const messagesRef = gameRoomRef.collection("messages") as CollectionReference<Message>;
  await messagesRef.add({
    createdAt: Timestamp.now(),
    playerName: "system",
    text: `${gamePlayer.displayName} played ${card.stringValue} of ${card.suit}`,
    uid: "system",
  });

  // 7. Check if the trick is over, if it is, find the winner, reset the trick and make the next lead player the trick winner
  const isTrickOver = newGameRoom.trickTakingPhase!.gameroomPlayersList.every((player) => player.currentCardOnTable);
  if (isTrickOver) {
    const leadCard = newGameRoom.trickTakingPhase!.gameroomPlayersList[leadPlayerIndex].currentCardOnTable!;
    const trumpSuit = newGameRoom.trickTakingPhase!.trumpSuit;

    // Any cards that are not the leadCard suit are not eligible to win the trick, filter out only the cards that are the leadCard suit
    const isPileContainTrumpSuit = newGameRoom.trickTakingPhase!.gameroomPlayersList.some(
      (player) => trumpSuit === "NT" || player.currentCardOnTable!.suit === trumpSuit
    );

    console.log({ isPileContainTrumpSuit });
    const playersWhoCouldWin = newGameRoom.trickTakingPhase!.gameroomPlayersList.filter((player) => {
      if (isPileContainTrumpSuit && trumpSuit !== "NT") {
        return player.currentCardOnTable!.suit === trumpSuit;
      }

      // If pile doesn't contain trump suit or trump suit is NT, then get all cards that are the same suit as the lead card
      return player.currentCardOnTable!.suit === leadCard.suit;
    });

    // Find the highest card from the players who could win
    const winner = playersWhoCouldWin.reduce((p0, p1) => {
      return p0.currentCardOnTable!.value > p1.currentCardOnTable!.value ? p0 : p1;
    });

    const trickWinnerIndex = newGameRoom.trickTakingPhase!.gameroomPlayersList.findIndex(
      (player) => player.position === winner.position
    );
    console.log({ winner, trickWinnerIndex });

    const nextRoundGameRoom = produce(newGameRoom, (gameRoom) => {
      gameRoom.trickTakingPhase!.gameroomPlayersList[trickWinnerIndex].numTricksWon++;
      gameRoom.trickTakingPhase!.leadPlayerIndex = trickWinnerIndex as 0 | 1 | 2 | 3;
      gameRoom.trickTakingPhase!.currentPlayerIndex = trickWinnerIndex as 0 | 1 | 2 | 3;
      gameRoom.trickTakingPhase!.gameroomPlayersList.forEach((player) => {
        player.currentCardOnTable = null;
      });
    });

    console.log({ nextRoundGameRoom: JSON.stringify(nextRoundGameRoom) });

    const hiddenTrickPhaseRef = gameRoomRef
      .collection("hiddenTrickPhase")
      .doc("hiddenTrickPhase") as DocumentReference<TrickTakingPhaseHidden>;

    const hiddenTrickPhase = (await hiddenTrickPhaseRef.get()).data()!;

    const newHiddenTrickPhase = produce(hiddenTrickPhase, (hiddenTrickPhase) => {
      // If winner is from declarer team, add the win to declarer's pile
      const isWinnerFromDeclarer = !!hiddenTrickPhase.declarerTeam.playerList.find(
        (player) => player.position === winner.position
      );

      if (isWinnerFromDeclarer) {
        hiddenTrickPhase.declarerTeam.tricksWon++;
      } else {
        hiddenTrickPhase.defenderTeam.tricksWon++;
      }
    });

    console.log({ newHiddenTrickPhase: JSON.stringify(newHiddenTrickPhase) });

    await hiddenTrickPhaseRef.update(newHiddenTrickPhase);

    const isDeclarerTeamWon =
      newHiddenTrickPhase.declarerTeam.tricksWon === newHiddenTrickPhase.declarerTeam.tricksNeeded;

    const isDefenderTeamWon =
      newHiddenTrickPhase.defenderTeam.tricksWon === newHiddenTrickPhase.defenderTeam.tricksNeeded;

    const isGameOver = isDeclarerTeamWon || isDefenderTeamWon;

    if (isGameOver) {
      const winnerLookup = {
        Declarer: newHiddenTrickPhase.declarerTeam.playerList,
        Defender: newHiddenTrickPhase.defenderTeam.playerList,
      };
      const endedPhase: EndedPhase = {
        winnerTeam: { playerList: winnerLookup[isDeclarerTeamWon ? "Declarer" : "Defender"] },
      };

      const finalGameRoom: GameRoom = { ...nextRoundGameRoom, status: "Ended", endedPhase: endedPhase };
      console.log({ finalGameRoom });
      await gameRoomRef.update(finalGameRoom);

      // TODO: Update winner playerProfile numGamesWon
      return;
    }

    await messagesRef.add({
      createdAt: Timestamp.now(),
      playerName: "system",
      text: `${winner.displayName} won the trick. ${winner.displayName} will lead the next trick.`,
      uid: "system",
    });
    await gameRoomRef.update(nextRoundGameRoom);
    await gamePlayerRef.update(newGamePlayer);
    return;
  }
  await gameRoomRef.update(newGameRoom);
  await gamePlayerRef.update(newGamePlayer);
});
