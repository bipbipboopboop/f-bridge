import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from "unique-names-generator";
import { AvatarID, PlayerProfile } from "types/PlayerProfile";

const AVATAR_IDS: AvatarID[] = ["blueDino", "greenDino", "redDino", "yellowDino"];

export const createPlayerProfile = functions
  .region("asia-east2")
  .auth.user()
  .onCreate(async (user) => {
    try {
      // Check if the player profile already exists
      const playerProfileRef = admin.firestore().collection("playerProfiles").doc(user.uid);

      const playerProfileSnapshot = await playerProfileRef.get();
      if (playerProfileSnapshot.exists) {
        console.log("Player profile already exists.");
        return;
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
        email: user.email || null,
        avatarID: AVATAR_IDS[Math.floor(Math.random() * AVATAR_IDS.length)],
        country: "International",
        numOfGamesPlayed: 0,
        numOfGamesWon: 0,
        roomID: null,
      };

      console.log({ playerProfile });

      // Create the player profile
      await playerProfileRef.set(playerProfile);

      console.log("Player profile created successfully.");
    } catch (error) {
      console.error("Error creating player profile:", error);
    }
  });
