import {createContext, ReactNode, useEffect, useState} from "react";

import {auth} from "../firebase";
import {signInAnonymously, User} from "firebase/auth";
import {PlayerProfile} from "types/PlayerProfile";

import {useAuthState} from "react-firebase-hooks/auth";
import Loading from "../components/loading";
import useFunctions from "../hooks/useFunctions";
import {toast} from "react-toastify";

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

  const {createPlayerProfile, retrieveMyPlayerProfile, isLoading, error} = useFunctions();

  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  // Signs the user in anonymously if they don't log in and creates a player profile for them.
  // Otherwise, they are already logged in and we can just retrieve their player profile.
  useEffect(() => {
    (async () => {
      console.log({firebaseUser, isLoadingFirebaseUser});
      if (isLoadingFirebaseUser) return;

      if (!firebaseUser) {
        await signInAnonymously(auth);
      }

      if (firebaseUser) {
        const playerProfile = (await retrieveMyPlayerProfile())?.data;

        if (playerProfile) {
          setPlayerProfile(playerProfile);
          return;
        }

        const newUserInfo = {
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
          providerId: firebaseUser.providerId,
        };
        const newPlayerProfile = (await createPlayerProfile(newUserInfo))!.data;
        setPlayerProfile(newPlayerProfile);
      }
    })();
    return () => {};
  }, [firebaseUser, isLoadingFirebaseUser]);

  const authContextValue: AuthContextValue = {
    user: firebaseUser || null,
    playerProfile: playerProfile,
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
