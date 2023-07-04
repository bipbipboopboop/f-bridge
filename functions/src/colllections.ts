import { firestore as firestoreFn } from "firebase-admin";
import { GameRoom, GameRoomPlayer, GameRoomTeam } from "./GameType";
import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { PlayerProfile } from "types/PlayerProfile";

export const FIRESTORE = firestoreFn();
export const PLAYERS_COLLECTION = FIRESTORE.collection("playerProfiles") as CollectionReference<PlayerProfile>;
export const GAME_ROOMS_COLLECTION = FIRESTORE.collection("gameRooms") as CollectionReference<GameRoom>;

export function gameRoomPlayersCollection(gameRoomRef: DocumentReference<GameRoom>) {
  return gameRoomRef.collection("players") as CollectionReference<GameRoomPlayer>;
}

export function gameRoomTeamsCollection(gameRoomRef: DocumentReference<GameRoom>) {
  return gameRoomRef.collection("teams") as CollectionReference<GameRoomTeam>;
}
