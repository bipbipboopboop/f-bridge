import { firestore as firestoreFn } from "firebase-admin";
import { GameRoom, GameRoomPlayer, GameRoomTeam } from "./GameType";
import { CollectionReference, DocumentReference, DocumentSnapshot } from "firebase-admin/firestore";
import { PlayerProfile } from "types/PlayerProfile";
import { HttpsError } from "firebase-functions/v1/auth";

export const FIRESTORE = firestoreFn();
export const PLAYERS_COLLECTION = FIRESTORE.collection("playerProfiles") as CollectionReference<PlayerProfile>;
export const GAME_ROOMS_COLLECTION = FIRESTORE.collection("gameRooms") as CollectionReference<GameRoom>;

export function gameRoomPlayersCollection(gameRoomRef: DocumentReference<GameRoom>) {
  return gameRoomRef.collection("players") as CollectionReference<GameRoomPlayer>;
}

export function gameRoomTeamsCollection(gameRoomRef: DocumentReference<GameRoom>) {
  return gameRoomRef.collection("teams") as CollectionReference<GameRoomTeam>;
}

export async function unwrap<T>(snapshotPromise: Promise<DocumentSnapshot<T>>): Promise<T> {
  const snapshot = await snapshotPromise;
  const doc = snapshot.data();
  if (!doc) {
    throw new HttpsError("not-found", "Resource not found - this should not happen");
  }
  return doc;
}
