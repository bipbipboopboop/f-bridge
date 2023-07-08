import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { useDocumentData } from "react-firebase-hooks/firestore";

import { firestore } from "../firebase";
import { User } from "firebase/auth";
import { PlayerProfile } from "types/PlayerProfile";

import Loading from "../components/Loading";
import useFunctions from "../hooks/useFunctions";
import { doc, DocumentReference } from "firebase/firestore";
import AuthContext from "./AuthProvider";
import { toast } from "react-toastify";

export const ProfileContext = createContext<ProfileContextValue>({
  user: null,
  playerProfile: null,
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  /**
   * HOOKS
   */
  const { user: firebaseUser } = useContext(AuthContext);
  const { createPlayerProfile, isLoading: isCreatingPlayer, error } = useFunctions();
  const playerProfileRef = (firebaseUser && doc(firestore, `playerProfiles/${firebaseUser.uid}`)) || null;
  const [playerProfile, isLoadingPlayerProfile] = useDocumentData<PlayerProfile>(
    playerProfileRef as DocumentReference<PlayerProfile>
  );

  console.log({ playerProfile, firebaseUser });

  console.log("hi");
  useEffect(() => {
    if (isLoadingPlayerProfile) return;

    if (firebaseUser && !playerProfile) {
      (async () => {
        const result = await createPlayerProfile({
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
          providerId: firebaseUser.providerId,
        });
        console.log({ result });
      })();
    }
  }, [firebaseUser?.uid, playerProfile]);

  if (!firebaseUser) return <Loading />;
  if (isLoadingPlayerProfile) return <Loading />;
  if (isCreatingPlayer) return <Loading />;

  const profileContextValue: ProfileContextValue = {
    user: firebaseUser || null,
    playerProfile: playerProfile || null,
  };

  if (error) {
    toast.error(error.message);
    console.log({ error });
  }

  return <ProfileContext.Provider value={profileContextValue}>{children}</ProfileContext.Provider>;
};

interface ProfileContextValue {
  user: User | null;
  playerProfile: PlayerProfile | null;
}

export default ProfileContext;
