import { database } from "firebase-admin";

export function getMessagesRef(roomID: string) {
  return database().ref(`gameRooms/${roomID}/messages`);
}

export function getMessagePlayerRef(roomID: string, uid: string) {
  return database().ref(`gameRooms/${roomID}/players/${uid}`);
}
