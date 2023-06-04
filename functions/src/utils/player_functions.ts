import * as admin from "firebase-admin";
import {DocumentReference} from "firebase-admin/firestore";
import {PlayerProfile} from "types/PlayerProfile";

const retrievePlayerProfile = async (
  playerID: string,
  shouldQueryData: boolean
) => {
  const db = admin.firestore();
  const playerProfileRef = db
    .collection("playerProfiles")
    .doc(playerID) as DocumentReference<PlayerProfile>;

  console.log({
    retrievePlayerProfile_playerProfileRef: playerProfileRef,
    retrievePlayerProfile_playerID: playerID,
    retrievePlayerProfile_shouldQueryData: shouldQueryData,
  });

  let playerProfile: PlayerProfile | null = null;
  if (shouldQueryData) {
    const playerProfileSnapshot = await playerProfileRef.get();
    playerProfile = playerProfileSnapshot.data() || null;

    console.log({retrievePlayerProfile_playerProfile: playerProfile});
  }
  return {playerProfileRef, playerProfile};
};

const updatePlayerProfile = async (
  playerID: string,
  updatedFields: Partial<PlayerProfile>
) => {
  const {playerProfileRef} = await retrievePlayerProfile(playerID, false);
  playerProfileRef.update(updatedFields);
};

const deletePlayerProfile = async (playerID: string) => {
  const {playerProfileRef} = await retrievePlayerProfile(playerID, false);
  playerProfileRef.delete();
};

export {retrievePlayerProfile, updatePlayerProfile, deletePlayerProfile};
