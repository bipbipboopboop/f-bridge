import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { CollectionReference, DocumentReference, Timestamp } from "firebase-admin/firestore";
import { produce } from "immer";

import { RestrictedAccountInfo } from "types/Account";

import { GameRoom } from "types/Room";

import { Card } from "types/Card";
import { PrivateTrickTakingPhase, PublicEndedPhase, RestrictedPlayerData } from "types/GameState";
import { Message } from "types/Message";
import { UnauthenticatedError } from "./error/error";
import { PublicPlayer } from "types/Player";

export const playCard = functions.region("asia-east2").https.onCall(async (card: Card, context) => {
  // 0. Check if the user is authenticated
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

  // Get the user's room
  const gameRoomRef = admin
    .firestore()
    .collection("gameRooms")
    .doc(playerAccount.roomID) as DocumentReference<GameRoom>;

  const gameRoom = (await gameRoomRef.get()).data();

  if (!gameRoom) {
    throw new functions.https.HttpsError("not-found", "This room does not exist.");
  }

  // 1. Check if the game is in the trick taking phase
  if (gameRoom.status !== "Taking Trick") {
    throw new functions.https.HttpsError("failed-precondition", "You can't play cards in this phase.");
  }

  const trickTakingPhase = gameRoom.phase.trickTakingPhase;

  if (!trickTakingPhase) {
    throw new functions.https.HttpsError("failed-precondition", "You can't play cards in this phase.");
  }

  const uid = context.auth.uid;
  const currentPlayer = gameRoom.players.find((player) => player.id === uid);

  if (!currentPlayer) {
    throw new functions.https.HttpsError("failed-precondition", "Player is not in the room.");
  }

  // 3. Check if it's the player's turn
  if (currentPlayer.position !== trickTakingPhase.currentPlayerIndex) {
    throw new functions.https.HttpsError("failed-precondition", "It's not your turn yet.");
  }

  // 4. Check if the card belongs to the player
  const restrictedPlayerRef = gameRoomRef
    .collection("restrictedPlayerCards")
    .doc(currentPlayer.id) as DocumentReference<RestrictedPlayerData>;

  const restrictedPlayer = (await restrictedPlayerRef.get()).data();

  if (!restrictedPlayer) {
    throw new functions.https.HttpsError("not-found", "Couldn't find your restricted player data.");
  }

  if (!restrictedPlayer.cards.find((playerCard) => playerCard.suit === card.suit && playerCard.rank === card.rank)) {
    throw new functions.https.HttpsError("failed-precondition", "You don't have this card.");
  }

  // 5. Check if the suit of the card is the same as the suit of the first card played, if not, check if the player has a card of the same suit
  // If the player is the leading player, then the suit of the card is the suit of the first card played and the player can play any card
  const leadPlayerIndex = trickTakingPhase.leadPlayerIndex;
  const isLeadingPlayer = currentPlayer.position === leadPlayerIndex;
  if (!isLeadingPlayer) {
    const leadPlayer = gameRoom.players.find((player) => player.position === leadPlayerIndex);
    const firstCardOnTable = leadPlayer!.currentCardOnTable!;
    if (firstCardOnTable.suit !== card.suit) {
      const hasCardOfSameSuit = restrictedPlayer.cards.some((playerCard) => playerCard.suit === firstCardOnTable.suit);
      if (hasCardOfSameSuit) {
        throw new functions.https.HttpsError("failed-precondition", `You must play a ${firstCardOnTable.suit} card.`);
      }
    }
  }

  const updatedPlayers = produce(gameRoom.players, (players) => {
    const playerIndex = players.findIndex((player) => player.id === currentPlayer.id);
    players[playerIndex].currentCardOnTable = card;
    players[playerIndex].numCardsOnHand--;
  });

  const updatedTrickTakingPhase = produce(trickTakingPhase, (phase) => {
    phase.currentPlayerIndex = ((phase.currentPlayerIndex + 1) % 4) as 0 | 1 | 2 | 3;
  });

  const updatedRestrictedPlayer = produce(restrictedPlayer, (player) => {
    player.cards = player.cards.filter(
      (playerCard) => !(playerCard.suit === card.suit && playerCard.rank === card.rank)
    );
  });

  await restrictedPlayerRef.update(updatedRestrictedPlayer);

  const messagesRef = gameRoomRef.collection("messages") as CollectionReference<Message>;
  await messagesRef.add({
    createdAt: Timestamp.now(),
    playerName: "system",
    text: `${currentPlayer.displayName} played ${card.rank} of ${card.suit}`,
    uid: "system",
  });

  // 7. Check if the trick is over, if it is, find the winner, reset the trick and make the next lead player the trick winner
  const isTrickOver = updatedPlayers.every((player) => player.currentCardOnTable);
  if (isTrickOver) {
    const leadCard = updatedPlayers[leadPlayerIndex].currentCardOnTable!;
    const trumpSuit = updatedTrickTakingPhase.trumpSuit;

    let playersWhoCouldWin: PublicPlayer[];

    if (trumpSuit) {
      // Check if there are any trump cards played
      const trumpCardsPlayed = updatedPlayers.filter((player) => player.currentCardOnTable!.suit === trumpSuit);
      if (trumpCardsPlayed.length > 0) {
        // If there are trump cards, the player with the highest trump card wins
        playersWhoCouldWin = trumpCardsPlayed;
      } else {
        // If no trump cards are played, the player with the highest card of the lead suit wins
        playersWhoCouldWin = updatedPlayers.filter((player) => player.currentCardOnTable!.suit === leadCard.suit);
      }
    } else {
      // If there is no trump suit, the player with the highest card of the lead suit wins
      playersWhoCouldWin = updatedPlayers.filter((player) => player.currentCardOnTable!.suit === leadCard.suit);
    }

    const winner = playersWhoCouldWin.reduce((p0, p1) => {
      return p0.currentCardOnTable!.value > p1.currentCardOnTable!.value ? p0 : p1;
    });

    const trickWinnerIndex = updatedPlayers.findIndex((player) => player.id === winner.id);

    const updatedRoom: GameRoom = {
      ...gameRoom,
      phase: {
        ...gameRoom.phase,
        trickTakingPhase: updatedTrickTakingPhase,
      },
      players: updatedPlayers,
      announcements: [
        ...gameRoom.announcements,
        {
          id: Timestamp.now().toMillis().toString(),
          title: "Trick Winner",
          content: `${winner.displayName} won the trick! ${winner.displayName} will start the next trick.`,
          createdAt: Timestamp.now().toDate(),
        },
      ],
    };

    await gameRoomRef.update(updatedRoom);

    setTimeout(async () => {
      const nextRoundTrickTakingPhase = produce(updatedTrickTakingPhase, (phase) => {
        phase.leadPlayerIndex = trickWinnerIndex as 0 | 1 | 2 | 3;
        phase.currentPlayerIndex = trickWinnerIndex as 0 | 1 | 2 | 3;
      });

      const nextRoundPlayers = produce(updatedPlayers, (players) => {
        players.forEach((player) => {
          player.currentCardOnTable = null;
        });
        players[trickWinnerIndex].numTricksWon++;
      });

      const privateTrickTakingPhaseRef = gameRoomRef
        .collection("privateGameState")
        .doc("trickTakingPhase") as DocumentReference<PrivateTrickTakingPhase>;

      const privateTrickTakingPhase = (await privateTrickTakingPhaseRef.get()).data()!;

      const updatedPrivateTrickTakingPhase = produce(privateTrickTakingPhase, (phase) => {
        const isWinnerFromDeclarer = phase.declarerTeam.players.some((player) => player.id === winner.id);
        if (isWinnerFromDeclarer) {
          phase.declarerTeam.tricksWon++;
        } else {
          phase.defenderTeam.tricksWon++;
        }
      });

      await privateTrickTakingPhaseRef.update(updatedPrivateTrickTakingPhase);

      const isDeclarerTeamWon =
        updatedPrivateTrickTakingPhase.declarerTeam.tricksWon >=
        updatedPrivateTrickTakingPhase.declarerTeam.tricksNeeded;
      const isDefenderTeamWon =
        updatedPrivateTrickTakingPhase.defenderTeam.tricksWon >=
        updatedPrivateTrickTakingPhase.defenderTeam.tricksNeeded;

      const isGameOver = isDeclarerTeamWon || isDefenderTeamWon;

      if (isGameOver) {
        const winnerTeam = isDeclarerTeamWon ? "Declarer" : "Defender";
        const winners = isDeclarerTeamWon
          ? updatedPrivateTrickTakingPhase.declarerTeam.players
          : updatedPrivateTrickTakingPhase.defenderTeam.players;
        const winnerIDs = winners.map((winner) => winner.id);

        await Promise.all(
          winnerIDs.map(async (winnerId) => {
            const winnerAccountRef = admin.firestore().collection("accounts").doc(winnerId);
            const winnerAccount = (await winnerAccountRef.get()).data() as RestrictedAccountInfo;

            await winnerAccountRef.update({
              numOfGamesWon: winnerAccount.numOfGamesWon + 1,
              numOfGamesPlayed: winnerAccount.numOfGamesPlayed + 1,
              roomID: null,
            });
          })
        );

        await Promise.all(
          gameRoom.players.map(async (player) => {
            const loserAccountRef = admin.firestore().collection("accounts").doc(player.id);
            const loserAccount = (await loserAccountRef.get()).data() as RestrictedAccountInfo;

            await loserAccountRef.update({
              numOfGamesPlayed: loserAccount.numOfGamesPlayed + 1,
              roomID: null,
            });
          })
        );

        const endedPhase: PublicEndedPhase = {
          winnerTeam,
          winners,
        };

        await gameRoomRef.update({
          status: "Ended",
          "phase.trickTakingPhase": null,
          "phase.endedPhase": endedPhase,
          players: nextRoundPlayers,
          announcements: [
            ...updatedRoom.announcements,
            {
              id: Timestamp.now().toMillis().toString(),
              title: "Game Over",
              content: `${winnerTeam} team has won the game!`,
              createdAt: Timestamp.now().toDate(),
            },
          ],
        });
      } else {
        await gameRoomRef.update({
          "phase.trickTakingPhase": nextRoundTrickTakingPhase,
          players: nextRoundPlayers,
        });
      }
    }, 2000);

    return { success: true };
  }

  await gameRoomRef.update({
    "phase.trickTakingPhase": updatedTrickTakingPhase,
    players: updatedPlayers,
  });

  return { success: true };
});
