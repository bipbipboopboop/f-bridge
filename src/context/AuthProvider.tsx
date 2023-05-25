import {createContext, ReactNode, useEffect} from "react";

import {auth, functions} from "../firebase";
import {User} from "firebase/auth";
import {PlayerProfile} from "types/PlayerProfile";

import {useAuthState} from "react-firebase-hooks/auth";
import {useHttpsCallable} from "react-firebase-hooks/functions";
import Loading from "../components/Loading";

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

  const error = firebaseUserError || playerProfileError;

  useEffect(() => {
    if (firebaseUser) {
      retreiveMyPlayerProfile();
    }
    return () => {};
  }, [firebaseUser, retreiveMyPlayerProfile]);

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
