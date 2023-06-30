import * as functions from "firebase-functions";
import { Card } from "types/Card";
import { getGameRoomOrThrow, getPlayerInRoomOrThrow, getUidOrThrow } from "./common";
import { GAME_ROOMS_COLLECTION, gameRoomPlayersCollection } from "./colllections";
import { GameState, TrickTakingPhase } from "./GameType";
import { HttpsError } from "firebase-functions/v1/auth";
import { GameRoomPlayer } from "types/PlayerProfile";

function getTrickTakingPhaseOrThrow(gameState: GameState): TrickTakingPhase {
  const { trickTakingPhase } = gameState;
  if (!trickTakingPhase) {
    throw new HttpsError("failed-precondition", "The game must be in trick taking phase");
  }
  return trickTakingPhase;
}

function requirePlayerTurn(trickTakingPhase: TrickTakingPhase, gameRoomPlayer: GameRoomPlayer) {}

function handleLogic() {}

function updateDatabase() {}

export const playCard = functions.https.onCall(async ({ card, roomID }: { card: Card; roomID: string }, context) => {
  // check whether the player is authenticated
  const uid = getUidOrThrow(context);

  const gameRoomRef = GAME_ROOMS_COLLECTION.doc(roomID);
  const gameRoom = await getGameRoomOrThrow(gameRoomRef);
  const gameState = gameRoom.state;
  const trickTakingPhase = getTrickTakingPhaseOrThrow(gameState);

  const gameRoomPlayerRef = gameRoomPlayersCollection(gameRoomRef).doc(uid);
  const gameRoomPlayer = await getPlayerInRoomOrThrow(gameRoomPlayerRef);

  requirePlayerTurn(trickTakingPhase, gameRoomPlayer);
  handleLogic();
  updateDatabase();
});
