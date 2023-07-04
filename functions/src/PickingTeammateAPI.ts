import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/auth";
import {
  Card,
  GameRoomPlayer,
  GameRoomTeam,
  GameState,
  PickingTeammatePhase,
  PlayerPositionPair,
  TeamLabel,
} from "./GameType";
import { FIRESTORE, GAME_ROOMS_COLLECTION, gameRoomPlayersCollection, gameRoomTeamsCollection } from "./colllections";
import { getAllPlayersInRoom, getGameRoomOrThrow, getUidOrThrow, isSameCard, nextPlayerPosition } from "./common";

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
  declarer: PlayerPositionPair;
  defender: PlayerPositionPair;
};

function getPlayerFromArrayOrThrow(players: GameRoomPlayer[], uid: string) {
  const player = players.find(p => p.ID === uid);
  if (!player) {
    throw new HttpsError("failed-precondition", "No such player in room");
  }
  return player;
}

function getPickingTeammatePhaseOrThrow(gameState: GameState): PickingTeammatePhase {
  const { status, pickingTeammatePhase } = gameState;
  if (status !== "picking teammate") {
    throw new HttpsError("failed-precondition", "The game must be in picking teammate phase");
  }
  return pickingTeammatePhase!;
}

function requireCorrectPlayer(pickingTeammatePhase: PickingTeammatePhase, gameRoomPlayer: GameRoomPlayer) {
  const { playerPosition } = pickingTeammatePhase;
  const { position } = gameRoomPlayer;
  if (position !== playerPosition) {
    throw new HttpsError("failed-precondition", "This player cannot pick a teammate on their own");
  }
}

function requireCardNotOnHand({ cardsOnHand }: GameRoomPlayer, card: Card) {
  if (cardsOnHand.find(c => isSameCard(c, card))) {
    throw new HttpsError("failed-precondition", "Card must be on other player's hand");
  }
}

function splitTeams(player: GameRoomPlayer, players: GameRoomPlayer[], card: Card): PickTeammateResult {
  const { position } = players.find(p => p.cardsOnHand.find(c => isSameCard(c, card)))!;
  const declarer = [player.position, position];
  const defender = players.map(p => p.position).filter(p => !declarer.includes(p));
  return {
    declarer: declarer as PlayerPositionPair,
    defender: defender as PlayerPositionPair,
  };
}

function updateGameState(
  gameState: GameState,
  { position }: GameRoomPlayer,
  { declarer, defender }: PickTeammateResult
): {
  nextGameState: GameState;
  declarer: GameRoomTeam;
  defender: GameRoomTeam;
} {
  const { trumpSuit, bidNumber } = gameState.pickingTeammatePhase!;
  const nextGameState = { ...gameState };

  const leadPlayerPosition = nextPlayerPosition(position);
  nextGameState.status = "taking trick";
  nextGameState.takingTrickPhase = {
    currentPlayerPosition: leadPlayerPosition,
    trumpSuit,
    cardsOnBoard: [],
  };
  return {
    nextGameState,
    declarer: {
      label: "declarer",
      players: declarer,
      tricksWon: 0,
      tricksNeeded: 6 + bidNumber,
    },
    defender: {
      label: "defender",
      players: defender,
      tricksWon: 0,
      tricksNeeded: 8 - bidNumber,
    },
  };
}

export const pickTeammate = functions.https.onCall(async ({ card, roomID }: { card: Card; roomID: string }, context) => {
  const uid = getUidOrThrow(context);
  const gameRoomRef = GAME_ROOMS_COLLECTION.doc(roomID);
  const gameRoom = await getGameRoomOrThrow(gameRoomRef);
  const gameState = gameRoom.state;
  const pickingTeammatePhase = getPickingTeammatePhaseOrThrow(gameState);
  const gameRoomPlayersCollectionRef = gameRoomPlayersCollection(gameRoomRef);
  const gameRoomTeamsCollectionRef = gameRoomTeamsCollection(gameRoomRef);
  const gameRoomPlayers = await getAllPlayersInRoom(gameRoomPlayersCollectionRef);
  const gameRoomPlayer = getPlayerFromArrayOrThrow(gameRoomPlayers, uid);

  requireCorrectPlayer(pickingTeammatePhase, gameRoomPlayer);
  requireCardNotOnHand(gameRoomPlayer, card);
  const pickTeammateResult = splitTeams(gameRoomPlayer, gameRoomPlayers, card);
  const { nextGameState, declarer, defender } = updateGameState(gameState, gameRoomPlayer, pickTeammateResult);

  const batch = FIRESTORE.batch();
  batch.update(gameRoomRef, { state: nextGameState });
  batch.create(gameRoomTeamsCollectionRef.doc("declarer" as TeamLabel), declarer);
  batch.create(gameRoomTeamsCollectionRef.doc("defender" as TeamLabel), defender);
  for (const player of gameRoomPlayers) {
    const ref = gameRoomPlayersCollectionRef.doc(player.ID);
    const teamLabel: TeamLabel = declarer.players.includes(player.position) ? "declarer" : "defender";
    batch.update(ref, { teamLabel });
  }
  await batch.commit();
});
