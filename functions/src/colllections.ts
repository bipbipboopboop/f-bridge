import { firestore as firestoreFn } from "firebase-admin";

// TODO: write API specs and make this consistent
const firestore = firestoreFn();
export const PLAYERS_COLLECTION = firestore.collection("playerProfiles");
export const GAMES_COLLECTION = firestore.collection("gameState");
export const GAME_STATES_COLLECTION = firestore.collection("gameState");
