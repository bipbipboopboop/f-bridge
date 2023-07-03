import * as admin from "firebase-admin";
import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { GameRoom } from "types/GameRoom";

const listRoom = async (shouldQueryData: boolean) => {
  const db = admin.firestore();
  const roomListRef = db.collection("rooms") as CollectionReference<GameRoom>;

  let roomList: GameRoom[] | null | undefined = null;
  if (shouldQueryData) {
    const roomListSnapshot = await roomListRef.get();
    roomList = roomListSnapshot.docs.map((doc) => doc.data());
  }
  return { roomListRef, roomList };
};

const retrieveRoom = async (roomID: string, shouldQueryData: boolean) => {
  const db = admin.firestore();
  const roomRef = db.collection("rooms").doc(roomID) as DocumentReference<GameRoom>;

  let room: GameRoom | null = null;
  if (shouldQueryData) {
    const roomSnapshot = await roomRef.get();
    room = roomSnapshot.data() || null;
  }
  return { roomRef, room };
};

const updateRoom = async (roomID: string, updatedFields: Partial<GameRoom>) => {
  const { roomRef } = await retrieveRoom(roomID, false);
  roomRef.update(updatedFields);
};

const deleteRoom = async (roomID: string) => {
  const { roomRef } = await retrieveRoom(roomID, false);
  roomRef.delete();
};

export { listRoom, retrieveRoom, updateRoom, deleteRoom };
