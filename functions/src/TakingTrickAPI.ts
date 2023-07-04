import * as functions from "firebase-functions";
import {
  compareCard,
  getGameRoomOrThrow,
  getPlayerInRoomOrThrow,
  getUidOrThrow,
  isSameCard,
  nextPlayerPosition,
} from "./common";
import {
  FIRESTORE,
  GAME_ROOMS_COLLECTION,
  gameRoomPlayersCollection,
  gameRoomTeamsCollection,
  unwrap,
} from "./colllections";
import {
  BidSuit,
  Card,
  GameRoomPlayer,
  GameRoomTeam,
  GameState,
  PlayedCard,
  PlayerPosition,
  TakingTrickPhase,
} from "./GameType";
import { HttpsError } from "firebase-functions/v1/auth";
import { Transaction } from "firebase-admin/firestore";

function getTakingTrickPhaseOrThrow(gameState: GameState): TakingTrickPhase {
  const { status, takingTrickPhase } = gameState;
  if (status !== "taking trick") {
    throw new HttpsError("failed-precondition", "The game must be in taking trick phase");
  }
  return takingTrickPhase!;
}

function requirePlayerTurn(takingTrickPhase: TakingTrickPhase, gameRoomPlayer: GameRoomPlayer) {
  const { currentPlayerPosition } = takingTrickPhase;
  const { position } = gameRoomPlayer;
  if (currentPlayerPosition !== position) {
    throw new HttpsError("failed-precondition", "It's not the player turn");
  }
}

function requireCardOnHand({ cardsOnHand }: GameRoomPlayer, card: Card) {
  if (!cardsOnHand.find(c => isSameCard(c, card))) {
    throw new HttpsError("failed-precondition", "No such card on the player hand");
  }
}

function requireCorrectSuit(takingTrickPhase: TakingTrickPhase, { cardsOnHand }: GameRoomPlayer, card: Card) {
  const { cardsOnBoard } = takingTrickPhase;
  if (!cardsOnBoard.length) {
    // there is no card on the board at the moment
    return;
  }
  const leadSuit = cardsOnBoard[0].card.suit;
  if (cardsOnHand.some(c => c.suit === leadSuit) && card.suit !== leadSuit) {
    throw new HttpsError("failed-precondition", "The player must follow the lead suit");
  }
}

/**
 * Find the position of the winner of this round
 */
function findWinner(cards: PlayedCard[], trumpSuit: BidSuit) {
  const leadSuit = cards[0].card.suit;
  let winner = cards[0];
  for (const playedCard of cards) {
    if (compareCard(winner.card, playedCard.card, leadSuit, trumpSuit) < 0) {
      winner = playedCard;
    }
  }
  return winner;
}

async function updateGameState(
  gameState: GameState,
  player: GameRoomPlayer,
  teamSupplier: (winnerID: string) => Promise<GameRoomTeam>,
  card: Card
): Promise<{
  nextGameState: GameState;
  nextTeamState?: GameRoomTeam;
  nextPlayerState: GameRoomPlayer;
}> {
  let { cardsOnBoard, currentPlayerPosition, trumpSuit } = gameState.takingTrickPhase!;
  let nextTeamState = undefined;
  cardsOnBoard = [...cardsOnBoard, { card, playerID: player.ID, position: player.position }];

  const nextGameState = { ...gameState };
  if (cardsOnBoard.length === 4) {
    const { playerID, position } = findWinner(cardsOnBoard, trumpSuit);
    const { tricksWon, tricksNeeded, label, players } = await teamSupplier(playerID);
    nextTeamState = { label, tricksWon: tricksWon + 1, tricksNeeded, players };
    if (nextTeamState.tricksWon === tricksNeeded) {
      nextGameState.status = "game over";
      nextGameState.winners = players;
    } else {
      cardsOnBoard = [];
      currentPlayerPosition = nextPlayerPosition(position);
    }
  } else {
    currentPlayerPosition = nextPlayerPosition(currentPlayerPosition);
  }
  nextGameState.takingTrickPhase = {
    trumpSuit,
    cardsOnBoard,
    currentPlayerPosition,
  };
  const nextPlayerState = {
    ...player,
    cardsOnHand: player.cardsOnHand.filter(c => !isSameCard(c, card)),
  };
  return { nextGameState, nextPlayerState, nextTeamState };
}

export const playCard = functions.https.onCall(async ({ card, roomID }: { card: Card; roomID: string }, context) => {
  // check whether the player is authenticated
  const uid = getUidOrThrow(context);

  const gameRoomRef = GAME_ROOMS_COLLECTION.doc(roomID);
  const gameRoom = await getGameRoomOrThrow(gameRoomRef);
  const gameState = gameRoom.state;
  const takingTrickPhase = getTakingTrickPhaseOrThrow(gameState);

  const gameRoomPlayersCollectionRef = gameRoomPlayersCollection(gameRoomRef);
  const gameRoomTeamsCollectionRef = gameRoomTeamsCollection(gameRoomRef);
  const gameRoomPlayerRef = gameRoomPlayersCollectionRef.doc(uid);
  const gameRoomPlayer = await getPlayerInRoomOrThrow(gameRoomPlayerRef);

  requirePlayerTurn(takingTrickPhase, gameRoomPlayer);
  requireCardOnHand(gameRoomPlayer, card);
  requireCorrectSuit(takingTrickPhase, gameRoomPlayer, card);

  // TODO: refactor this
  const transaction = async (t: Transaction) => {
    const { nextGameState, nextTeamState, nextPlayerState } = await updateGameState(
      gameState,
      gameRoomPlayer,
      async winnerID => {
        const winnerRef = gameRoomPlayersCollectionRef.doc(winnerID);
        const { teamLabel } = await unwrap(t.get(winnerRef));
        const teamRef = gameRoomTeamsCollectionRef.doc(teamLabel!);
        return await unwrap(t.get(teamRef));
      },
      card
    );
    t.update(gameRoomRef, { state: nextGameState });
    t.update(gameRoomPlayerRef, nextPlayerState);
    if (nextTeamState) {
      const { label } = nextTeamState;
      t.update(gameRoomTeamsCollectionRef.doc(label), nextTeamState);
    }
  };
  await FIRESTORE.runTransaction(transaction);
});
