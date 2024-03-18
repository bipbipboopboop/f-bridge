import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from "unique-names-generator";
import { AvatarID } from "types/Avatar";
import { RestrictedAccountInfo } from "types/Account";

const AVATAR_IDS: AvatarID[] = ["blueDino", "greenDino", "redDino", "yellowDino"];

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
