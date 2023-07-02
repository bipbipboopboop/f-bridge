import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { uniqueNamesGenerator, Config, adjectives, colors, animals } from "unique-names-generator";

import { PlayerProfile } from "types/PlayerProfile";
import { DocumentReference } from "firebase-admin/firestore";
import { UserInfo } from "firebase-admin/auth";
import { UnauthenticatedError } from "./error/error";

export const createPlayerProfile = functions.region("asia-east2").https.onCall(async (user: UserInfo, context) => {
  try {
    if (!context.auth) throw UnauthenticatedError;

    // Check if the player profile already exists
    const playerProfileRef = admin
      .firestore()
      .collection("playerProfiles")
      .doc(user.uid) as DocumentReference<PlayerProfile>;
    const playerProfileSnapshot = await playerProfileRef.get();
    if (playerProfileSnapshot.exists) {
      throw new functions.https.HttpsError("already-exists", "Player profile already exists.");
    }

    // Check if the authenticated user ID matches the provided user ID
    if (context.auth.uid !== user.uid) {
      throw new functions.https.HttpsError("permission-denied", "User ID does not match authenticated user.");
    }

    const nameConfig: Config = {
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      length: 2,
    };
    const randomName = uniqueNamesGenerator(nameConfig);

    const playerProfile: PlayerProfile = {
      id: user.uid,
      displayName: user.displayName || randomName,
      email: user.email,
      avatarID: null,
      country: "International",
      numOfGamesPlayed: 0,
      numOfGamesWon: 0,
      roomID: null,
    };
    // Create the player profile
    await playerProfileRef.set(playerProfile);

    return playerProfile;
  } catch (error) {
    console.error("Error creating player:", error);
    throw new functions.https.HttpsError("internal", "Error creating player");
  }
});
