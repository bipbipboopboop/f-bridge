import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from "unique-names-generator";
import { AvatarID } from "types/Avatar";
import { RestrictedAccountInfo } from "types/Account";
import { GameRoom } from "types/Room";

const AVATAR_IDS: AvatarID[] = [
  "blueDino",
  "greenDino",
  "redDino",
  "yellowDino",
  "jungleMan",
  "finn",
  "kucingDasco",
  "popcat",
];

export const createAccount = functions
  .region("asia-east2")
  .auth.user()
  .onCreate(async (user) => {
    try {
      // Check if the player account already exists
      const playerAccountRef = admin.firestore().collection("accounts").doc(user.uid);

      const playerAccountSnapshot = await playerAccountRef.get();
      if (playerAccountSnapshot.exists) {
        console.log("Player account already exists.");
        return;
      }

      const nameConfig: Config = {
        dictionaries: [adjectives, colors, animals],
        separator: "-",
        length: 2,
      };

      const randomName = uniqueNamesGenerator(nameConfig);

      const playerAccount: RestrictedAccountInfo = {
        id: user.uid,
        displayName: user.displayName || randomName,
        email: user.email || null,
        avatarID: AVATAR_IDS[Math.floor(Math.random() * AVATAR_IDS.length)],
        country: "International",
        numOfGamesPlayed: 0,
        numOfGamesWon: 0,
        roomID: null,
      };

      console.log({ playerAccount });

      // Create the player account
      await playerAccountRef.set(playerAccount);

      console.log("Player account created successfully.");
    } catch (error) {
      console.error("Error creating player account:", error);
    }
  });

export const renameUser = functions.region("asia-east2").https.onCall(async (newName: string, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in to rename your account.");
  }

  if (typeof newName !== "string" || newName.length < 3 || newName.length > 20) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "New name must be a string between 3 and 20 characters long."
    );
  }

  const uid = context.auth.uid;
  const db = admin.firestore();

  try {
    // Get the user's account info
    const accountRef = db.collection("accounts").doc(uid);
    const accountDoc = await accountRef.get();

    if (!accountDoc.exists) {
      throw new functions.https.HttpsError("not-found", "User account not found.");
    }

    const accountData = accountDoc.data() as RestrictedAccountInfo;

    // Check if the user is in a room
    if (accountData.roomID) {
      const roomRef = db.collection("gameRooms").doc(accountData.roomID);
      const roomDoc = await roomRef.get();

      if (roomDoc.exists) {
        const roomData = roomDoc.data() as GameRoom;

        // Check if the room status is not "Waiting"
        if (roomData.status !== "Waiting") {
          throw new functions.https.HttpsError(
            "failed-precondition",
            "You cannot change your name while you are in a game!"
          );
        }

        // Update the user's name in the game room
        const updatedPlayers = roomData.players.map((player) =>
          player.id === uid ? { ...player, displayName: newName } : player
        );

        await roomRef.update({ players: updatedPlayers });
      }
    }

    // Update the user's name in their account
    await accountRef.update({ displayName: newName });

    return { success: true };
  } catch (error) {
    console.error("Error renaming user:", error);
    throw new functions.https.HttpsError("internal", "An error occurred while renaming the user.");
  }
});
