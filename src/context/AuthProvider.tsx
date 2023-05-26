import {createContext, ReactNode, useEffect} from "react";

import {auth, functions} from "../firebase";
import {signInAnonymously, User} from "firebase/auth";
import {PlayerProfile} from "types/PlayerProfile";

import {useAuthState} from "react-firebase-hooks/auth";
import {useHttpsCallable} from "react-firebase-hooks/functions";
import Loading from "../components/loading";
import useFunctions from "../hooks/useFunctions";

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoggedIn: false,
  isLoggingIn: false,
});

export const AuthProvider = ({children}: AuthProviderProps) => {
  /**
   * HOOKS
   */
  const [firebaseUser, isLoadingFirebaseUser, firebaseUserError] =
    useAuthState(auth);

  const [
    retreiveMyPlayerProfile,
    isLoadingMyPlayerProfile,
    playerProfileError,
  ] = useHttpsCallable<void, PlayerProfile>(
    functions,
    "retrieveMyPlayerProfile"
  );

  const {createAnonymousPlayer} = useFunctions();

  const error = firebaseUserError || playerProfileError;

  // Signs the user in anonymously if they don't log in and creates a player profile for them.
  // Otherwise, they are already logged in and we can just retrieve their player profile.
  useEffect(() => {
    (async () => {
      if (!auth.currentUser && !isLoadingFirebaseUser) {
        await signInAnonymously(auth);
        await createAnonymousPlayer();
      }

      if (auth.currentUser) {
        const playerProfile = (await retreiveMyPlayerProfile())!.data;
        console.log({playerProfile});
      }
    })();
    return () => {};
  }, [firebaseUser, isLoadingFirebaseUser, retreiveMyPlayerProfile]);

  const authContextValue: AuthContextValue = {
    user: firebaseUser as User | null,
    isLoggedIn: true,
    isLoggingIn: isLoadingFirebaseUser || isLoadingMyPlayerProfile,
  };

  if (error) {
    alert(error.message);
  }

  if (authContextValue.isLoggingIn) return <Loading />;

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
}

export default AuthContext;
