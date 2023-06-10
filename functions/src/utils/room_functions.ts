import * as admin from "firebase-admin";
import {CollectionReference, DocumentReference} from "firebase-admin/firestore";
import {GameState} from "types/GameState";

const listRoom = async (shouldQueryData: boolean) => {
  const db = admin.firestore();
  const roomListRef = db.collection("rooms") as CollectionReference<GameState>;

  let roomList: GameState[] | null | undefined = null;
  if (shouldQueryData) {
    const roomListSnapshot = await roomListRef.get();
    roomList = roomListSnapshot.docs.map((doc) => doc.data());
  }
  return {roomListRef, roomList};
};

const retrieveRoom = async (roomID: string, shouldQueryData: boolean) => {
  const db = admin.firestore();
  const roomRef = db
    .collection("rooms")
    .doc(roomID) as DocumentReference<GameState>;

  let room: GameState | null = null;
  if (shouldQueryData) {
    const roomSnapshot = await roomRef.get();
    room = roomSnapshot.data() || null;
  }
  return {roomRef, room};
};

const updateRoom = async (
  roomID: string,
  updatedFields: Partial<GameState>
) => {
  const {roomRef} = await retrieveRoom(roomID, false);
  roomRef.update(updatedFields);
};

const deleteRoom = async (roomID: string) => {
  const {roomRef} = await retrieveRoom(roomID, false);
  roomRef.delete();
};

export {listRoom, retrieveRoom, updateRoom, deleteRoom};
