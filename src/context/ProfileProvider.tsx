import { createContext, ReactNode, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { firestore } from "../firebase";
import { User } from "firebase/auth";
import { doc, DocumentReference } from "firebase/firestore";

import { PlayerProfile } from "types/PlayerProfile";

import Loading from "../components/Loading";
import useFunctions from "../hooks/useFunctions";
import AuthContext from "./AuthProvider";

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

  useEffect(() => {
    if (isLoadingPlayerProfile) return;
    if (!firebaseUser) return; // If no user, do nothing
    if (playerProfile) return; // If player profile already exists, do nothing
    if (isCreatingPlayer) return;

    (async () => {
      console.log("Creating player profile");
      await createPlayerProfile({
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        phoneNumber: firebaseUser.phoneNumber,
        photoURL: firebaseUser.photoURL,
        uid: firebaseUser.uid,
        providerId: firebaseUser.providerId,
      });
    })();

    return () => {};
  }, [firebaseUser?.uid, playerProfile?.id, isLoadingPlayerProfile, isCreatingPlayer]);

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
