import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {Message} from "types/Chat";
import {DocumentReference} from "firebase-admin/firestore";
import {GameState} from "types/GameState";

export const sendMessage = functions.https.onCall(
  async (data: {roomID: string; message: string}, context) => {
    // Get the roomID and message from the data parameter
    const {roomID, message} = data;

    // Verify that the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User is not authenticated."
      );
    }

    // Get the user's ID
    const userID = context.auth.uid;

    // Check if the player is in the room
    const roomRef = admin
      .firestore()
      .collection("gameRooms")
      .doc(roomID) as DocumentReference<GameState>;
    const roomSnapshot = await roomRef.get();
    const roomData = roomSnapshot.data();

    if (!roomData || !roomData.players.find((player) => player.id === userID)) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Player is not in the room."
      );
    }

    // Create a new message object
    const newMessage: Message = {
      uid: userID,
      playerName: roomData.players.find((player) => player.id === userID)!
        .displayName,
      text: message,
      createdAt: new Date().toString(),
    };

    // Add the message to the messages subcollection of the room
    await roomRef.collection("messages").add(newMessage);

    // Return a success message
    return {message: "Message sent successfully."};
  }
);
