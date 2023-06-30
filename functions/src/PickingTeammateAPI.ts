import * as functions from "firebase-functions";
import { getGameRoomOrThrow, getPlayerInRoomOrThrow, getUidOrThrow } from "./common";
import { GAME_ROOMS_COLLECTION, gameRoomPlayersCollection } from "./colllections";
import { Card, GameState } from "./GameType";

/*
 * What do we need to pick a teammate?
 * - We need to know the roomID, the playerID (to be safe)
 * - We need the card that the bid winner declared
 * - Afterward, the API will look at all the players' hands and update the game state to trick taking phase
 */

/*
 * On what condition will the request be rejected?
 * - The player is not authenticated
 * - The player sent the request is not the one who win the bid
 * - Invalid card?
 * - Game does not exist
 */

function getPickingTeammatePhaseOrThrow(gameState: GameState): any {}

function requireCorrectPlayer() {}

function findOtherPlayer() {}

function updateDatabase() {}

const pickTeammate = functions.https.onCall(async ({ card, roomID }: { card: Card; roomID: string }, context) => {
  const uid = getUidOrThrow(context);

  const gameRoomRef = GAME_ROOMS_COLLECTION.doc(roomID);
  const gameRoom = await getGameRoomOrThrow(gameRoomRef);
  const gameState = gameRoom.state;
  const pickingTeammatePhase = getPickingTeammatePhaseOrThrow(gameState);

  const gameRoomPlayerRef = gameRoomPlayersCollection(gameRoomRef).doc(uid);
  const gameRoomPlayer = await getPlayerInRoomOrThrow(gameRoomPlayerRef);

  requireCorrectPlayer();
  findOtherPlayer();

  updateDatabase();
});
