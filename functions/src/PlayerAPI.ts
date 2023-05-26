import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import {PlayerProfile} from "types/PlayerProfile";
import {DocumentReference} from "firebase-admin/firestore";

const firestore = admin.firestore();

export const retrieveMyPlayerProfile = functions.https.onCall(
  async (data: void, context) => {
    // Check if the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The request must be made by an authenticated user."
      );
    }

    const userId = context.auth.uid;

    try {
      const playerProfileRef = firestore
        .collection("playerProfiles")
        .doc(userId) as DocumentReference<PlayerProfile>;
      const playerProfileDoc = await playerProfileRef.get();

      if (!playerProfileDoc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Player profile not found."
        );
      }
      const playerProfileData = playerProfileDoc.data();
      return playerProfileData;
    } catch (error) {
      console.error("Error retrieving player profile:", error);
      throw new functions.https.HttpsError(
        "internal",
        "An error occurred while retrieving player profile."
      );
    }
  }
);

export const createAnonymousPlayer = functions.https.onCall(
  async (_: void, context) => {
    try {
      const nameConfig: Config = {
        dictionaries: [adjectives, colors, animals],
        separator: "-",
        length: 2,
      };
      const displayName = uniqueNamesGenerator(nameConfig);

      const userID = context.auth!.uid;

      // Create player profile document with the anonymous ID
      const playerProfileRef = admin
        .firestore()
        .collection("playerProfiles")
        .doc(userID) as DocumentReference<PlayerProfile>;

      await playerProfileRef.set({
        displayName,
        email: "",
        country: "International",

        numOfGamesPlayed: 0,
        numOfGamesWon: 0,
        id: userID,
        roomID: "",
      });

      const playerProfile = (
        await playerProfileRef.get()
      ).data() as PlayerProfile;

      return playerProfile;
    } catch (error) {
      console.error("Error creating anonymous player:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Error creating anonymous player"
      );
    }
  }
);

export const deleteAnonymousPlayer = functions.auth
  .user()
  .onDelete(async (user) => {
    try {
      // Delete player profile document using the user's UID
      await admin
        .firestore()
        .collection("playerProfiles")
        .doc(user.uid)
        .delete();
      console.log("Anonymous player deleted successfully.");
    } catch (error) {
      console.error("Error deleting anonymous player:", error);
    }
  });

export const createPermanentPlayer = functions.https.onCall(
  async (data, context) => {}
);
