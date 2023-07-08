import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { useDocumentData } from "react-firebase-hooks/firestore";

import { firestore } from "../firebase";
import { User } from "firebase/auth";
import { PlayerProfile } from "types/PlayerProfile";

import Loading from "../components/Loading";
import useFunctions from "../hooks/useFunctions";
import { doc, DocumentReference } from "firebase/firestore";
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
  const { createPlayerProfile, isLoading: isCreatingPlayer } = useFunctions();
  const playerProfileRef = (firebaseUser && doc(firestore, `playerProfiles/${firebaseUser.uid}`)) || null;
  const [playerProfile, isLoadingPlayerProfile] = useDocumentData<PlayerProfile>(
    playerProfileRef as DocumentReference<PlayerProfile>
  );
  const [isDone, setIsDone] = useState(false);
  console.log({ firebaseUser, playerProfile });
  useEffect(() => {
    if (firebaseUser && !playerProfile) {
      (async () => {
        console.log("hi");
        await createPlayerProfile(firebaseUser);
        setIsDone(true);
      })();
    }
  }, [firebaseUser]);

  console.log({ isDone });
  if (!isDone) return <Loading />;
  if (!firebaseUser) return <Loading />;
  if (isLoadingPlayerProfile) return <Loading />;
  if (isCreatingPlayer) return <Loading />;

  const profileContextValue: ProfileContextValue = {
    user: firebaseUser || null,
    playerProfile: playerProfile || null,
  };

  return <ProfileContext.Provider value={profileContextValue}>{children}</ProfileContext.Provider>;
};

interface ProfileContextValue {
  user: User | null;
  playerProfile: PlayerProfile | null;
}

export default ProfileContext;
