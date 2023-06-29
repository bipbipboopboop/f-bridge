import { firestore as firestoreFn } from "firebase-admin";
import { GameRoom } from "./GameType";
import { CollectionReference } from "firebase-admin/firestore";
import { PlayerProfile } from "types/PlayerProfile";

// TODO: write API specs and make this consistent
const firestore = firestoreFn();
export const PLAYERS_COLLECTION = firestore.collection("playerProfiles") as CollectionReference<PlayerProfile>;

/**
 * Inside this, there is another subcollection named "players"
 */
export const GAME_ROOMS_COLLECTION = firestore.collection("gameRooms") as CollectionReference<GameRoom>;
