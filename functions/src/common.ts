import { DocumentReference } from "firebase-admin/firestore";
import { CallableContext, HttpsError } from "firebase-functions/v1/https";
import { GameRoom, GameRoomPlayer, GameState } from "./GameType";

export function getUidOrThrow(context: CallableContext): string {
  const { auth } = context;
  if (!auth) {
    throw new HttpsError("unauthenticated", "The user is not authenticated");
  }
  return auth.uid;
}

export async function getGameRoomOrThrow(gameRoomRef: DocumentReference<GameRoom>): Promise<GameRoom> {
  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoom = gameRoomSnapshot.data();
  if (!gameRoom) {
    throw new HttpsError("not-found", "The game does not exist");
  }
  return gameRoom;
}

export async function getPlayerInRoomOrThrow(
  gameRoomPlayerRef: DocumentReference<GameRoomPlayer>
): Promise<GameRoomPlayer> {
  const gameRoomPlayerSnapshot = await gameRoomPlayerRef.get();
  const gameRoomPlayer = gameRoomPlayerSnapshot.data();
  if (!gameRoomPlayer) {
    throw new HttpsError("failed-precondition", "No such player in the room");
  }
  return gameRoomPlayer;
}

/**
 * Flushes all the changes into the database
 */
export async function updateDatabase(gameRoomRef: DocumentReference<GameRoom>, state: GameState) {
  await gameRoomRef.update({ state });
}
