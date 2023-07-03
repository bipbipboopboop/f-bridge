import * as functions from "firebase-functions";
import { getGameRoomOrThrow, getPlayerInRoomOrThrow, getUidOrThrow, updateDatabase } from "./common";
import { GAME_ROOMS_COLLECTION, gameRoomPlayersCollection } from "./colllections";
import {
  Card,
  GameState,
  PickingTeammatePhase,
  GameRoomPlayer,
  GameRoomTeam,
  TeamLabel,
  PlayerPosition,
} from "./GameType";
import { HttpsError } from "firebase-functions/v1/auth";

/*
 * What information do we need to pick a teammate?
 * - We need to know the roomID, the playerID (to be safe)
 * - We need the card that the bid winner declared
 * - Afterward, the API will look at all the players' hands and update the game state to trick taking phase
 *
 * On what condition will the request be rejected?
 * - The player is not authenticated
 * - The player sent the request is not the one who win the bid
 * - Invalid card?
 * - Game does not exist
 */

export type PickTeammateResult = {
  firstTeam: GameRoomTeam;
  secondTeam: GameRoomTeam;
};

function getPickingTeammatePhaseOrThrow(gameState: GameState): PickingTeammatePhase {
  const { status, pickingTeammatePhase } = gameState;
  if (status !== "picking teammate") {
    throw new HttpsError("failed-precondition", "The game must be in picking teammate phase");
  }
  return pickingTeammatePhase!;
}

function requireCorrectPlayer(pickingTeammatePhase: PickingTeammatePhase, gameRoomPlayer: GameRoomPlayer) {
  const { playerID } = pickingTeammatePhase;
  const { ID } = gameRoomPlayer;
  if (ID !== playerID) {
    throw new HttpsError("failed-precondition", "This player cannot pick a teammate on their own");
  }
}

function isSameCards(first: Card, second: Card) {
  return first.suit === second.suit && first.value === second.value;
}

function handleLogic(player: GameRoomPlayer, players: GameRoomPlayer[], card: Card): PickTeammateResult {
  const { position } = players.find(p => p.cardsInHand.find(c => isSameCards(c, card)))!;
  const first = [player.position, position];
  const second = players.map(p => p.position).filter(p => first.indexOf(p) < 0);
  return {
    firstTeam: { label: "declarer", players: first as [PlayerPosition, PlayerPosition] },
    secondTeam: { label: "defender", players: second as [PlayerPosition, PlayerPosition] },
  };
}

function updateGameState(gameState: GameState, { firstTeam, secondTeam }: PickTeammateResult): GameState {
  // update the game state to TRICK TAKING phase
  const newGameState = { ...gameState };
  newGameState.status = "taking trick";
  newGameState.trickTakingPhase = {
    currentPlayerIndex: 0,
    leadPlayerIndex: 0,
    trumpSuit: gameState.biddingPhase!.highestBid!.bid.suit,
    firstTeam,
    secondTeam,
  };
  return newGameState;
}

export const pickTeammate = functions.https.onCall(async ({ card, roomID }: { card: Card; roomID: string }, context) => {
  const uid = getUidOrThrow(context);

  const gameRoomRef = GAME_ROOMS_COLLECTION.doc(roomID);
  const gameRoom = await getGameRoomOrThrow(gameRoomRef);
  const gameState = gameRoom.state;
  const pickingTeammatePhase = getPickingTeammatePhaseOrThrow(gameState);

  const gameRoomPlayersCollectionRef = gameRoomPlayersCollection(gameRoomRef);
  const gameRoomPlayersCollectionSnapshot = await gameRoomPlayersCollectionRef.get();
  const gameRoomPlayers = gameRoomPlayersCollectionSnapshot.docs.map(ref => ref.data());
  const gameRoomPlayer = gameRoomPlayers.find(player => player.ID === uid);
  if (!gameRoomPlayer) {
    throw new HttpsError("failed-precondition", "No such player in room");
  }

  requireCorrectPlayer(pickingTeammatePhase, gameRoomPlayer);
  const pickTeammateResult = handleLogic(gameRoomPlayer, gameRoomPlayers, card);
  const newGameState = updateGameState(gameState, pickTeammateResult);
  await updateDatabase(gameRoomRef, newGameState);
});
