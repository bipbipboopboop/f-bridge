import {createContext, ReactNode, useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useAuthState} from "react-firebase-hooks/auth";
import {useDocumentData} from "react-firebase-hooks/firestore";

import {auth, firestore} from "../firebase";
import {signInAnonymously, User} from "firebase/auth";
import {PlayerProfile} from "types/PlayerProfile";

import Loading from "../components/loading";
import useFunctions from "../hooks/useFunctions";
import {doc, DocumentReference} from "firebase/firestore";

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  playerProfile: null,
  isLoggingIn: false,
});

export const AuthProvider = ({children}: AuthProviderProps) => {
  /**
   * HOOKS
   */
  const [firebaseUser, isLoadingFirebaseUser, firebaseUserError] = useAuthState(auth);

  const {createPlayerProfile, isLoading, error} = useFunctions();

  const gamePlayerRef = doc(
    firestore,
    `playerProfiles/${firebaseUser?.uid || "ERROR"}`
  ) as DocumentReference<PlayerProfile>;

  const [playerProfile, isLoadingPlayerProfile] = useDocumentData<PlayerProfile>(gamePlayerRef);

  // Signs the user in anonymously if they don't log in and creates a player profile for them.
  // Otherwise, they are already logged in and we can just retrieve their player profile.
  useEffect(() => {
    (async () => {
      console.log({firebaseUser, isLoadingFirebaseUser});
      if (isLoadingFirebaseUser) return;

      if (!firebaseUser) {
        await signInAnonymously(auth);
        return;
      }

      if (!playerProfile && !isLoadingPlayerProfile) {
        const newUserInfo = {
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
          providerId: firebaseUser.providerId,
        };
        await createPlayerProfile(newUserInfo);
      }
    })();
    return () => {};
  }, [firebaseUser, isLoadingFirebaseUser]);

  const authContextValue: AuthContextValue = {
    user: firebaseUser || null,
    playerProfile: playerProfile || null,
    isLoggingIn: isLoadingFirebaseUser || isLoading,
  };

  if (firebaseUserError) {
    toast.error(firebaseUserError.message);
  }

  if (error) {
    toast.error(error.message);
  }

  if (authContextValue.isLoggingIn) return <Loading />;

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextValue {
  user: User | null;
  playerProfile: PlayerProfile | null;
  isLoggingIn: boolean;
}

export default AuthContext;
