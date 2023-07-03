import { firestore as firestoreFn } from "firebase-admin";
import { GameRoom, GameRoomPlayer } from "./GameType";
import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { PlayerProfile } from "types/PlayerProfile";

const firestore = firestoreFn();

export const PLAYERS_COLLECTION = firestore.collection("playerProfiles") as CollectionReference<PlayerProfile>;

/**
 * Inside this, there is another subcollection named "players"
 */
export const GAME_ROOMS_COLLECTION = firestore.collection("gameRooms") as CollectionReference<GameRoom>;

export function gameRoomPlayersCollection(
  gameRoomRef: DocumentReference<GameRoom>
): CollectionReference<GameRoomPlayer> {
  return gameRoomRef.collection("players") as CollectionReference<GameRoomPlayer>;
}
